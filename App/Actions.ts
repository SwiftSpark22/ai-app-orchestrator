'use client'
import { useState } from 'react';
import { startBuild } from './actions'; // We'll link to our server action

export default function AppBuilderUI() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [repoUrl, setRepoUrl] = useState('');

  async function handleLaunch(formData: FormData) {
    setStatus('loading');
    
    // This calls the "Engine Room" we built earlier
    const result = await startBuild(
      formData.get('prompt') as string, 
      formData.get('appName') as string
    );

    if (result.success) {
      setRepoUrl(result.repoUrl);
      setStatus('success');
      // On mobile, we can automatically open the new GitHub repo
      window.open(result.repoUrl, '_blank');
    }
  }

  if (status === 'loading') return <LoadingState />; // Use the "Glow Orb" we refined!

  return (
    <form action={handleLaunch}>
       {/* ... your professional inputs and rocket button ... */}
    </form>
  );
}
