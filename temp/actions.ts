'use server'

import { Octokit } from "octokit";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function startBuild(prompt: string, appName: string) {
  try {
    // 1. Generate the Swift Code via AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a professional SwiftUI developer. Return ONLY valid code for ContentView.swift." },
        { role: "user", content: `Build a SwiftUI app that: ${prompt}` }
      ],
    });

    const swiftCode = completion.choices[0].message.content || "";

    // 2. Create the GitHub Repository for the user
    const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
      name: appName.replace(/\s+/g, '-'), // Ensures no spaces in repo name
      private: true,
    });

    // 3. Push the AI-generated code to the new repo
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: repo.owner.login,
      repo: repo.name,
      path: "ContentView.swift",
      message: "🚀 Initial AI App Generation",
      content: Buffer.from(swiftCode).toString('base64'),
    });

    return { success: true, repoUrl: repo.html_url };
  } catch (error: any) {
    console.error("Build Error:", error);
    return { success: false, error: error.message };
  }
}
