"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, X, FileText, BookOpen, MessageSquare, ChevronDown, FilePlus, ListTodo, AlertCircle, FileUp, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'application' | 'action' | 'error' | 'document' | 'scholarship_matches';
  data?: any;
  status?: 'sending' | 'sent' | 'error';
  matches?: any[];
};

type ScholarshipApplication = {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  status: 'draft' | 'in_progress' | 'submitted' | 'won' | 'rejected';
  progress: number;
  deadline?: string;
  documents: {
    type: 'essay' | 'recommendation' | 'transcript' | 'other';
    name: string;
    status: 'pending' | 'uploaded' | 'generated';
    content?: string;
  }[];
  formData?: Record<string, any>;
  submissionDate?: string;
};

type QuickAction = {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  type?: 'action' | 'application';
  applicationId?: string;
};

export default function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeApplication, setActiveApplication] = useState<ScholarshipApplication | null>(null);
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastRequestTimeRef = useRef<number>(0);
  const rateLimitCooldownRef = useRef<number>(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDocumentUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file.');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File is too large. Maximum size is 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const messageId = `doc-${Date.now()}`;
    const documentMessage: Message = {
      id: messageId,
      content: `Uploading ${file.name}...`,
      isUser: true,
      timestamp: new Date(),
      type: 'document',
      status: 'sending',
      data: {
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        previewUrl: '',
        downloadUrl: ''
      }
    };

    setMessages(prev => [...prev, documentMessage]);
    setIsProcessing(true);

    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
          
          setMessages(prev => prev.map(msg => 
            msg.id === messageId 
              ? { 
                  ...msg, 
                  data: { 
                    ...msg.data, 
                    progress,
                    content: `Uploading ${file.name}... ${progress}%`
                  },
                  content: `Uploading ${file.name}... ${progress}%`
                } 
              : msg
          ));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          const fileUrl = response.fileUrl || '';
          
          setMessages(prev => prev.map(msg => 
            msg.id === messageId 
              ? { 
                  ...msg, 
                  status: 'sent',
                  content: `Uploaded ${file.name}`,
                  data: { 
                    ...msg.data, 
                    ...response, 
                    status: 'uploaded',
                    previewUrl: fileUrl,
                    downloadUrl: fileUrl
                  }
                } 
              : msg
          ));
          toast.success('Document uploaded successfully');
        } else {
          throw new Error('Upload failed');
        }
      };

      xhr.onerror = () => {
        throw new Error('Upload failed');
      };

      xhr.open('POST', '/api/documents/upload', true);
      xhr.send(formData);
    } catch (error) {
      console.error('Error uploading document:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              status: 'error',
              content: `Failed to upload ${file.name}`,
              type: 'error',
              data: {
                ...msg.data,
                error: 'Upload failed. Please try again.'
              }
            } 
          : msg
      ));
      toast.error('Failed to upload document');
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Handle empty input unless it's a command
    if ((!input.trim() && !input.startsWith('/')) || isProcessing) return;

    // Rate limiting disabled for testing
    // const now = Date.now();
    // const timeSinceLastRequest = now - lastRequestTimeRef.current;
    // const minDelay = 500; // 500ms minimum - very lenient
    // 
    // if (timeSinceLastRequest < minDelay) {
    //   // Just wait silently instead of blocking
    //   await new Promise(resolve => setTimeout(resolve, minDelay - timeSinceLastRequest));
    // }

    // Only enforce cooldown if we've actually hit a rate limit (not preemptively)
    // Removed preemptive cooldown check

    lastRequestTimeRef.current = Date.now();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      isUser: true,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsProcessing(true);

    try {
      // Handle application-specific commands
      if (input.startsWith('/')) {
        const [command, ...args] = input.slice(1).split(' ');
        
        switch(command.toLowerCase()) {
          case 'new':
            startNewApplication({ name: args.join(' ') || 'Custom Scholarship' });
            setIsLoading(false);
            setIsProcessing(false);
            return;
            
          case 'list':
            setMessages(prev => [...prev, {
              id: `list-${Date.now()}`,
              content: "Here are your current applications:",
              isUser: false,
              timestamp: new Date(),
              type: 'action',
              data: { action: 'list_applications', applications }
            }]);
            setIsLoading(false);
            setIsProcessing(false);
            return;
            
          case 'help':
            setMessages(prev => [...prev, {
              id: `help-${Date.now()}`,
              content: `Available commands:\n\n` +
                `/new [name] - Start a new application\n` +
                `/list - Show all applications\n` +
                `/help - Show this help message\n`,
              isUser: false,
              timestamp: new Date()
            }]);
            setIsLoading(false);
            setIsProcessing(false);
            return;
        }
      }

      // Update message status to sent
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
      ));

      // Get finder data from localStorage for context
      const finderData = localStorage.getItem("scholarshipFinderData");
      const parsedFinderData = finderData ? JSON.parse(finderData) : null;

      // Regular AI chat
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input,
          context: {
            activeApplication,
            applications,
            finderData: parsedFinderData,
            command: input.startsWith('/') ? input.slice(1) : undefined
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data);
        throw new Error(data.error || data.details || `HTTP error! status: ${response.status}`);
      }

      if (data.error) {
        console.error("API returned error:", data);
        throw new Error(data.error);
      }
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: data.reply || "I'm sorry, I couldn't generate a response. Please try again.",
        isUser: false,
        timestamp: new Date(),
        type: data.type || 'text',
        data: data.data,
        matches: data.matches
      };

      setMessages(prev => [...prev, aiMessage]);

      // Handle application updates from the AI
      if (data.type === 'application_update' && data.data) {
        const updatedApplications = applications.map(app => 
          app.id === data.data.id ? { ...app, ...data.data } : app
        );
        
        setApplications(updatedApplications);
        
        if (activeApplication?.id === data.data.id) {
          setActiveApplication(prev => prev ? { ...prev, ...data.data } : prev);
        }
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      // Handle rate limit errors with shorter cooldown
      if (error?.message?.includes('rate limit') || error?.status === 429) {
        // Set shorter cooldown period (10 seconds instead of 30)
        rateLimitCooldownRef.current = Date.now() + 10000;
        
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          content: "Rate limit exceeded. The system will automatically retry. Please wait a moment and try again.",
          isUser: false,
          timestamp: new Date(),
          type: 'error',
          status: 'error'
        };
        setMessages(prev => [...prev, errorMessage]);
        toast.error('Rate limit exceeded. Please wait a moment.', {
          duration: 3000,
        });
      } else {
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          content: error?.message || "Sorry, I encountered an error processing your request. Please try again.",
          isUser: false,
          timestamp: new Date(),
          type: 'error',
          status: 'error'
        };
        setMessages(prev => [...prev, errorMessage]);
        toast.error(error?.message || 'Failed to process your request');
      }
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  // Load saved applications from localStorage
  useEffect(() => {
    const savedApps = localStorage.getItem('scholarshipApplications');
    if (savedApps) {
      setApplications(JSON.parse(savedApps));
    }
  }, []);

  // Save applications to localStorage when they change
  useEffect(() => {
    if (applications.length > 0) {
      localStorage.setItem('scholarshipApplications', JSON.stringify(applications));
    }
  }, [applications]);

  const startNewApplication = (scholarship: any) => {
    const newApp: ScholarshipApplication = {
      id: `app-${Date.now()}`,
      scholarshipId: scholarship.id || 'custom',
      scholarshipName: scholarship.name || 'Custom Scholarship',
      status: 'draft',
      progress: 0,
      deadline: scholarship.deadline,
      documents: [
        { type: 'essay', name: 'Personal Statement', status: 'pending' },
        { type: 'recommendation', name: 'Letter of Recommendation', status: 'pending' },
      ],
    };
    
    setApplications(prev => [...prev, newApp]);
    setActiveApplication(newApp);
    
    // Add a welcome message for the new application
    setMessages(prev => [...prev, {
      id: `app-${Date.now()}`,
      content: `I'll help you apply for ${newApp.scholarshipName}. Let's get started!`,
      isUser: false,
      timestamp: new Date(),
      type: 'application',
      data: newApp
    }]);
  };

  const quickActions: QuickAction[] = [
    {
      title: "Find Scholarships",
      description: "Help me find scholarships matching my profile",
      icon: <BookOpen className="h-5 w-5" />,
      onClick: () => setInput("Help me find scholarships matching my profile"),
      type: 'action'
    },
    {
      title: "Start New Application",
      description: "Begin a new scholarship application",
      icon: <FilePlus className="h-5 w-5" />,
      onClick: () => startNewApplication({}),
      type: 'action'
    },
    {
      title: "My Applications",
      description: "View and manage your applications",
      icon: <ListTodo className="h-5 w-5" />,
      onClick: () => {
        setMessages(prev => [...prev, {
          id: `app-list-${Date.now()}`,
          content: "Here are your current applications:",
          isUser: false,
          timestamp: new Date(),
          type: 'action',
          data: { action: 'list_applications', applications }
        }]);
      },
      type: 'action'
    },
    ...applications.slice(0, 3).map(app => ({
      title: `Continue: ${app.scholarshipName}`,
      description: `Progress: ${app.progress}%`,
      icon: <FileText className="h-5 w-5" />,
      onClick: () => {
        setActiveApplication(app);
        setMessages(prev => [...prev, {
          id: `resume-${app.id}`,
          content: `Let's continue working on your application for ${app.scholarshipName}`,
          isUser: false,
          timestamp: new Date(),
          type: 'application',
          data: app
        }]);
      },
      type: 'application' as const,
      applicationId: app.id
    }))
  ];

  return !isOpen ? (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className="rounded-full h-16 w-16 p-0 shadow-lg bg-primary hover:bg-primary/90"
      >
        <Sparkles className="h-8 w-8" />
      </Button>
    </motion.div>
  ) : (
    <div className="fixed bottom-8 right-8 z-50">
      <Card className="w-96 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
        <div 
          className="bg-primary text-white p-4 cursor-pointer flex justify-between items-center"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">Scholarship Copilot</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
              className="p-1 hover:bg-white/10 rounded"
            >
              <ChevronDown className={`h-5 w-5 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-1 hover:bg-white/10 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <h3 className="font-semibold text-lg">How can I help you today?</h3>
                      <p className="text-sm text-muted-foreground">I'm your AI Scholarship Assistant</p>
                    </div>
                    <div className="space-y-3">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            action.onClick();
                            const textarea = document.querySelector('textarea');
                            textarea?.focus();
                          }}
                          className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                              {action.icon}
                            </div>
                            <div>
                              <p className="font-medium">{action.title}</p>
                              <p className="text-xs text-muted-foreground">{action.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.isUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-gray-100"
                          }`}
                        >
                          {message.type === 'error' ? (
                            <Alert variant="destructive" className="p-2">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Error</AlertTitle>
                              <AlertDescription className="text-xs">
                                {message.content}
                              </AlertDescription>
                            </Alert>
                          ) : message.type === 'document' ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 flex-shrink-0" />
                                <span className="text-sm font-medium truncate max-w-[200px]">{message.data?.name}</span>
                                {message.status === 'sending' ? (
                                  <span className="text-xs text-muted-foreground ml-auto">
                                    {message.data?.progress}%
                                  </span>
                                ) : message.status === 'error' ? (
                                  <span className="text-xs text-destructive ml-auto">Failed</span>
                                ) : (
                                  <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                                )}
                              </div>
                              {message.status === 'sending' && (
                                <Progress value={message.data?.progress || 0} className="h-1.5" />
                              )}
                              {message.status === 'sent' && message.data?.previewUrl && (
                                <div className="mt-2 flex flex-col gap-2">
                                  <a
                                    href={message.data.previewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                  >
                                    <FileText className="h-3 w-3" />
                                    <span>View Document</span>
                                  </a>
                                  <a
                                    href={message.data.downloadUrl}
                                    download={message.data.name}
                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                      <polyline points="7 10 12 15 17 10"></polyline>
                                      <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    <span>Download</span>
                                  </a>
                                </div>
                              )}
                              {message.data?.error && (
                                <p className="text-xs text-destructive mt-1">{message.data.error}</p>
                              )}
                            </div>
                          ) : message.type === 'scholarship_matches' && message.matches && message.matches.length > 0 ? (
                            <div className="space-y-3">
                              <div className="prose prose-sm max-w-none mb-3">
                                <ReactMarkdown
                                  components={{
                                    a: ({node, ...props}) => (
                                      <a 
                                        {...props} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                      />
                                    )
                                  }}
                                >
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                              <div className="space-y-2 max-h-64 overflow-y-auto">
                                {message.matches.slice(0, 5).map((match: any, idx: number) => {
                                  const sch = match.scholarship;
                                  const daysLeft = Math.ceil((new Date(sch.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                                  return (
                                    <div key={idx} className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-md transition-shadow">
                                      <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex-1">
                                          <h4 className="font-semibold text-sm text-gray-900 mb-1">{sch.name}</h4>
                                          <p className="text-xs text-gray-600">{sch.provider}</p>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-xs font-bold text-primary">{match.matchScore}%</div>
                                          <div className="text-xs text-gray-500">Match</div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                                        <span>💰 {sch.currency} {sch.amount?.toLocaleString() || 'Varies'}</span>
                                        <span>📍 {sch.country}</span>
                                        <span>⏰ {daysLeft}d left</span>
                                      </div>
                                      {match.matchReasons && match.matchReasons.length > 0 && (
                                        <div className="mb-2">
                                          <p className="text-xs text-green-700 font-medium mb-1">Why it matches:</p>
                                          <ul className="text-xs text-gray-600 space-y-0.5">
                                            {match.matchReasons.slice(0, 2).map((reason: string, rIdx: number) => (
                                              <li key={rIdx}>✓ {reason}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      <Link href={`/scholarships/${sch.id}`}>
                                        <Button size="sm" variant="outline" className="w-full mt-2 text-xs">
                                          View Details
                                          <ArrowRight className="h-3 w-3 ml-1" />
                                        </Button>
                                      </Link>
                                    </div>
                                  );
                                })}
                              </div>
                              {message.matches.length > 5 && (
                                <p className="text-xs text-gray-500 text-center">
                                  +{message.matches.length - 5} more matches available
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="prose prose-sm max-w-none">
                              <ReactMarkdown
                                components={{
                                  code({node, className, children, ...props}: any) {
                                    const inline = !className || !className.includes('language-');
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                      <pre className={`language-${match[1]} bg-gray-100 p-4 rounded overflow-x-auto`}>
                                        <code className={className} {...props}>
                                          {children}
                                        </code>
                                      </pre>
                                    ) : (
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    );
                                  },
                                  a: ({node, ...props}) => (
                                    <a 
                                      {...props} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    />
                                  )
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          )}
                          <p className="text-xs opacity-70 mt-1 text-right">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg p-3 bg-gray-100">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="relative">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about scholarships..."
                    className="pr-24 resize-none"
                    rows={2}
                    disabled={isProcessing}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <div className="absolute right-2 bottom-2 flex gap-1">
                    <input
                      type="file"
                      id="document-upload"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleDocumentUpload(e.target.files[0]);
                          // Reset the input to allow selecting the same file again
                          e.target.value = '';
                        }
                      }}
                      accept=".pdf,.doc,.docx,.txt"
                      disabled={isProcessing}
                    />
                    <label 
                      htmlFor="document-upload"
                      className="p-1.5 rounded-md hover:bg-muted cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                      title="Upload document"
                    >
                      <FileUp className="h-4 w-4" />
                    </label>
                    <Button
                      type="submit"
                      size="icon"
                      className="h-8 w-8"
                      disabled={!input.trim() || isProcessing}
                      onClick={(e) => {
                        if (isLoading) e.preventDefault();
                      }}
                    >
                      {isLoading ? (
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-background animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-background animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-background animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
