import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import prisma from "@/lib/prisma";

// POST /api/copilot/submit - Automate application submission (dry-run)
export async function POST(req: Request) {
  try {
    const { copilotRequestId, targetUrl, mapping } = await req.json();
    if (!copilotRequestId || !targetUrl || !mapping) {
      return NextResponse.json({ error: "Missing copilotRequestId, targetUrl, or mapping" }, { status: 400 });
    }

    // Prepare mapping file
    const mappingsPath = path.join("/tmp", `mapping-${copilotRequestId}.json`);
    await fs.promises.writeFile(mappingsPath, JSON.stringify(mapping, null, 2));

    // Run Playwright validation script (dry-run)
    const scriptPath = path.resolve("scripts/playwright-validation.ts");
    const outDir = path.join("/tmp", `out-${copilotRequestId}`);
    const cmd = `npx ts-node ${scriptPath} --url \"${targetUrl}\" --mappings \"${mappingsPath}\" --out \"${outDir}\"`;

    const result = await new Promise<string>((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) return reject(stderr || error.message);
        resolve(stdout);
      });
    });

    // Update CopilotRequest with submission result
    await prisma.copilotRequest.update({
      where: { id: copilotRequestId },
      data: {
        status: "submitted",
        auditLog: { submittedAt: new Date().toISOString(), result: result as any },
      },
    });

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
