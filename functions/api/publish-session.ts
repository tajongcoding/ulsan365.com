import { authorize, clearSessionCookie, hasSession, json, sessionCookie, type PublishAccessEnv } from '../_lib/publish-access';
export async function onRequest({request,env}:{request:Request;env:PublishAccessEnv}) {
  if (request.method === 'GET') return json({authenticated:await hasSession(request,env)});
  if (request.method === 'DELETE') {
    if (request.headers.get('Origin') !== new URL(request.url).origin) return json({error:'요청 출처를 확인해 주세요.'},403);
    const response = json({authenticated:false});
    response.headers.set('Set-Cookie',clearSessionCookie());
    return response;
  }
  if (request.method !== 'POST') return new Response(null,{status:405,headers:{Allow:'GET, POST, DELETE'}});
  const denied = await authorize(request,env);
  if (denied) return denied;
  const response = json({authenticated:true});
  response.headers.set('Set-Cookie',await sessionCookie(request,env));
  return response;
}
