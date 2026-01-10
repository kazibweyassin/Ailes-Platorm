import { runEmailScheduler } from "./email-scheduler";

/**
 * Email Scheduler Runner
 * Run this as a cron job every 5 minutes
 * Example: Every 5 minutes
 */

async function main() {
  console.log(`[${new Date().toISOString()}] Starting email scheduler...`);

  try {
    const result = await runEmailScheduler();
    console.log(`[${new Date().toISOString()}] Scheduler completed:`, result);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Scheduler error:`, error);
    process.exit(1);
  }
}

main();
