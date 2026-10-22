import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createStore } from './domain.mjs';
const root=new URL('./public/',import.meta.url);
/** Input: HTTP port (mặc định 4317). Output: server localhost giả lập để B chạy UI; không dùng production. */
export function createServer(){
  const store=createStore();
  return http.createServer(async(req,res)=>{
    const json=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
    try{
      const url=new URL(req.url,'http://localhost');
      if(url.pathname.startsWith('/api/')){
        // Server này chỉ rehearsal. Không mount nó làm backend thật của dự án.
        const role=req.headers['x-demo-role'];let body={};
        if(req.method==='POST'){let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>8192){const e=new Error('Payload too large');e.status=413;throw e;}}try{body=JSON.parse(raw||'{}');}catch{json(400,{message:'Invalid JSON'});return;}}
        if(req.method==='GET'&&url.pathname==='/api/me')return json(200,store.user(role));
        if(url.pathname==='/api/action-requests'){
          if(req.method==='GET')return json(200,{items:store.list(role)});
          if(req.method==='POST')return json(201,store.create(role,body));
        }
        if(req.method==='POST'&&url.pathname==='/api/demo/reset')return json(200,store.reset(role));
        const match=url.pathname.match(/^\/api\/action-requests\/([^/]+)\/(approve|reject|execute)$/);
        if(req.method==='POST'&&match)return json(200,store.action(role,decodeURIComponent(match[1]),match[2]));
        return json(404,{message:'Endpoint not found'});
      }
      const files={'/':'index.html','/index.html':'index.html','/styles.css':'styles.css','/app.js':'app.js','/api.js':'api.js','/config.js':'config.js'};
      if(!files[url.pathname]||req.method!=='GET'){res.writeHead(404);return res.end('Not found');}
      const file=files[url.pathname];const type=file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':'text/html';
      res.writeHead(200,{'Content-Type':`${type}; charset=utf-8`,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(await readFile(new URL(file,root)));
    }catch(error){json(error.status||500,{message:error.status?error.message:'Unexpected rehearsal server error'});}
  });
}
if(process.argv[1]===fileURLToPath(import.meta.url)){const port=Number(process.env.PORT||4317);createServer().listen(port,'127.0.0.1',()=>console.log(`Action Guard rehearsal: http://127.0.0.1:${port}`));}
