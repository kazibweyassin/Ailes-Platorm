/**
 * AI Response Cache System
 * Caches common scholarship questions and answers to reduce API calls
 */

import { createHash } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync, readdirSync } from 'fs';
import { join } from 'path';

interface CacheEntry {
  key: string;
  response: string;
  metadata?: {
    scholarshipId?: string;
    scholarshipName?: string;
    questionType?: string;
    createdAt: string;
    expiresAt?: string;
  };
}

class AICache {
  private memoryCache: Map<string, CacheEntry> = new Map();
  private cacheDir: string;
  private maxMemoryEntries = 1000; // Limit memory cache size

  constructor() {
    // Use .cache directory in project root
    this.cacheDir = join(process.cwd(), '.cache', 'ai-responses');
    this.ensureCacheDir();
    this.loadFromDisk();
  }

  private ensureCacheDir() {
    if (!existsSync(this.cacheDir)) {
      mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * Generate cache key from message and context
   */
  private generateKey(message: string, context?: any): string {
    const normalizedMessage = message.toLowerCase().trim();
    
    // Extract key context fields
    const contextHash = context ? {
      scholarshipId: context.scholarshipId,
      scholarshipName: context.scholarshipName,
      questionType: this.detectQuestionType(normalizedMessage),
    } : {};
    
    const keyString = JSON.stringify({ message: normalizedMessage, context: contextHash });
    return createHash('sha256').update(keyString).digest('hex');
  }

  /**
   * Detect question type from message
   */
  private detectQuestionType(message: string): string {
    const lower = message.toLowerCase();
    
    if (/how to apply|application process|steps|procedure/i.test(message)) {
      return 'application_steps';
    }
    if (/eligibility|requirements|qualify|need|must have/i.test(message)) {
      return 'eligibility';
    }
    if (/deadline|when|due date|close/i.test(message)) {
      return 'deadline';
    }
    if (/amount|funding|money|cost|cover|tuition/i.test(message)) {
      return 'funding';
    }
    if (/essay|personal statement|sop|motivation letter|document/i.test(message)) {
      return 'documents';
    }
    if (/tips|advice|recommendation|suggest/i.test(message)) {
      return 'tips';
    }
    if (/about|what is|tell me about|information/i.test(message)) {
      return 'general_info';
    }
    
    return 'general';
  }

  /**
   * Get cached response
   */
  get(message: string, context?: any): string | null {
    const key = this.generateKey(message, context);
    
    // Check memory cache first
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry) {
      // Check expiration
      if (memoryEntry.metadata?.expiresAt) {
        const expiresAt = new Date(memoryEntry.metadata.expiresAt);
        if (expiresAt < new Date()) {
          this.memoryCache.delete(key);
          return null;
        }
      }
      return memoryEntry.response;
    }
    
    // Check disk cache
    const diskEntry = this.loadFromDisk(key);
    if (diskEntry) {
      // Check expiration
      if (diskEntry.metadata?.expiresAt) {
        const expiresAt = new Date(diskEntry.metadata.expiresAt);
        if (expiresAt < new Date()) {
          this.deleteFromDisk(key);
          return null;
        }
      }
      // Load into memory cache
      this.memoryCache.set(key, diskEntry);
      return diskEntry.response;
    }
    
    return null;
  }

  /**
   * Set cached response
   */
  set(message: string, response: string, context?: any, ttlHours: number = 24 * 7): void {
    const key = this.generateKey(message, context);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + ttlHours);
    
    const entry: CacheEntry = {
      key,
      response,
      metadata: {
        scholarshipId: context?.scholarshipId,
        scholarshipName: context?.scholarshipName,
        questionType: this.detectQuestionType(message),
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
      },
    };
    
    // Store in memory cache
    if (this.memoryCache.size >= this.maxMemoryEntries) {
      // Remove oldest entry (simple FIFO)
      const firstKey = this.memoryCache.keys().next().value;
      if (firstKey) {
        this.memoryCache.delete(firstKey);
      }
    }
    this.memoryCache.set(key, entry);
    
    // Persist to disk
    this.saveToDisk(entry);
  }

  /**
   * Check if a response exists in cache
   */
  has(message: string, context?: any): boolean {
    return this.get(message, context) !== null;
  }

  /**
   * Clear cache (memory and disk)
   */
  clear(): void {
    this.memoryCache.clear();
    // Clear disk cache files
    try {
      const files = readdirSync(this.cacheDir);
      files.forEach((file: string) => {
        if (file.endsWith('.json')) {
          unlinkSync(join(this.cacheDir, file));
        }
      });
    } catch (error) {
      console.error('[AI Cache] Error clearing disk cache:', error);
    }
  }

  /**
   * Invalidate cache entries matching criteria
   */
  invalidate(criteria: {
    scholarshipId?: string;
    scholarshipName?: string;
    questionType?: string;
  }): number {
    let invalidated = 0;
    const keysToDelete: string[] = [];

    this.memoryCache.forEach((entry, key) => {
      const metadata: any = entry.metadata || {};
      let shouldInvalidate = false;

      if (criteria.scholarshipId && metadata.scholarshipId === criteria.scholarshipId) {
        shouldInvalidate = true;
      }
      if (criteria.scholarshipName && metadata.scholarshipName === criteria.scholarshipName) {
        shouldInvalidate = true;
      }
      if (criteria.questionType && metadata.questionType === criteria.questionType) {
        shouldInvalidate = true;
      }

      if (shouldInvalidate) {
        keysToDelete.push(key);
        this.deleteFromDisk(key);
        invalidated++;
      }
    });

    keysToDelete.forEach((key) => this.memoryCache.delete(key));
    return invalidated;
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): number {
    let cleaned = 0;
    const now = new Date();
    const keysToDelete: string[] = [];

    this.memoryCache.forEach((entry, key) => {
      if (entry.metadata?.expiresAt) {
        const expiresAt = new Date(entry.metadata.expiresAt);
        if (expiresAt < now) {
          keysToDelete.push(key);
          this.deleteFromDisk(key);
          cleaned++;
        }
      }
    });

    keysToDelete.forEach((key) => this.memoryCache.delete(key));
    return cleaned;
  }

  /**
   * Load entry from disk
   */
  private loadFromDisk(key?: string): CacheEntry | null {
    try {
      if (key) {
        const filePath = join(this.cacheDir, `${key}.json`);
        if (existsSync(filePath)) {
          const content = readFileSync(filePath, 'utf-8');
          return JSON.parse(content);
        }
      } else {
        // Load all cache files on startup (optional, for warm-up)
        // This could be expensive, so we'll do lazy loading instead
      }
    } catch (error) {
      console.error('[AI Cache] Error loading from disk:', error);
    }
    return null;
  }

  /**
   * Save entry to disk
   */
  private saveToDisk(entry: CacheEntry): void {
    try {
      const filePath = join(this.cacheDir, `${entry.key}.json`);
      writeFileSync(filePath, JSON.stringify(entry, null, 2), 'utf-8');
    } catch (error) {
      console.error('[AI Cache] Error saving to disk:', error);
    }
  }

  /**
   * Delete entry from disk
   */
  private deleteFromDisk(key: string): void {
    try {
      const filePath = join(this.cacheDir, `${key}.json`);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    } catch (error) {
      console.error('[AI Cache] Error deleting from disk:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { memoryEntries: number; questionTypes: Record<string, number> } {
    const questionTypes: Record<string, number> = {};
    
    this.memoryCache.forEach((entry) => {
      const type = entry.metadata?.questionType || 'unknown';
      questionTypes[type] = (questionTypes[type] || 0) + 1;
    });
    
    return {
      memoryEntries: this.memoryCache.size,
      questionTypes,
    };
  }
}

// Singleton instance
let cacheInstance: AICache | null = null;

export function getAICache(): AICache {
  if (!cacheInstance) {
    cacheInstance = new AICache();
  }
  return cacheInstance;
}

export type { CacheEntry };

