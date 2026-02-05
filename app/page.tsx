'use client'

import React, { useState } from 'react';
import { Sparkles, Github, Terminal, Rocket, Code2, Loader2, CheckCircle2 } from 'lucide-react';
import { startBuild } from './actions';

export default function AppOrchestrator() {
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');

  async function handleLaunch(formData: FormData) {
    setLoading(true);
    const result = await startBuild(
      formData.get('prompt') as string,
      formData.get('appName') as string
    );
    
    setLoading(false);
    if (result.success) {
      setFinished(true);
      setRepoUrl(result.repoUrl || '');
    } else {
      alert("Error: " + result.error);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0B0F1A] flex flex-col items-center justify-center text-white p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
        <div className="bg-slate-900 p-8 rounded-full border border-blue-500/30">
          <Rocket size={48} className="text-blue-400 animate-bounce" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-2">Architecting your App...</h2>
      <p className="text-slate-400">The AI is writing SwiftUI code and preparing your GitHub repository.</p>
    </div>
  );

  if (finished) return (
    <div className="min-h-screen bg-[#0B0F1A] flex flex-col items-center justify-center text-white p-6 text-center">
      <CheckCircle2 size={64} className="text-green-500 mb-6" />
      <h2 className="text-3xl font-bold mb-4">Mission Success!</h2>
      <p className="text-slate-400 mb-8">Your app has been pushed to GitHub.</p>
      <a href={repoUrl} target="_blank" className="px-8 py-4 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-all">
        View Code on GitHub
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200">
      <nav className="border-b border-slate-800 px-6 py-4 flex justify-between items-center bg-[#0B0F1A]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Rocket size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">AppOrchestra<span className="text-blue-500">.ai</span></span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6 pt-12">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <form action={handleLaunch} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">App Name</label>
              <input name="appName" required placeholder="My Awesome App" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Describe your idea</label>
              <textarea name="prompt" required rows={5} placeholder="e.g. A meditation app with a lavender theme and a breath timer..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
            </div>
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-500/20">
              <Rocket size={20} /> Launch to GitHub
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
