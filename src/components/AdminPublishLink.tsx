'use client';
import { useEffect, useState } from 'react';
export default function AdminPublishLink() {
  const [authenticated,setAuthenticated] = useState(false);
  useEffect(()=>{
    async function refresh() {
      try { const response=await fetch('/api/publish-session',{cache:'no-store'}); setAuthenticated(response.ok && (await response.json()).authenticated === true); }
      catch { setAuthenticated(false); }
    }
    void refresh();
    window.addEventListener('ulsan-admin-session',refresh); window.addEventListener('focus',refresh);
    return ()=>{window.removeEventListener('ulsan-admin-session',refresh);window.removeEventListener('focus',refresh);};
  },[]);
  if (!authenticated) return null;
  return <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-700">
    <a className="inline-block rounded border border-slate-400 px-4 py-2 font-semibold" href="/work/publish/">관리자 · 발행</a>
    <button type="button" className="ml-3 rounded px-3 py-2 underline" onClick={async()=>{
      const response=await fetch('/api/publish-session',{method:'DELETE'});
      if(response.ok){setAuthenticated(false);window.dispatchEvent(new Event('ulsan-admin-session'));}
    }}>로그아웃</button>
  </div>;
}
