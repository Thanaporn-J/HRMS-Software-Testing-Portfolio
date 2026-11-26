const http = require('node:http');
const users = {admin:'admin',staff:'staff'};
const sessions = new Map();
const employees = [{id:1,name:'Somchai',department:'IT'},{id:2,name:'Suda',department:'HR'}];
const {randomUUID}=require('node:crypto');
http.createServer(async(req,res)=>{
 const path=new URL(req.url,'http://localhost').pathname;
 const token=req.headers.cookie?.match(/(?:^|; )sid=([^;]+)/)?.[1];
 const role=sessions.get(token);
 const json=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(data));};
 if(path==='/api/login' && req.method==='POST'){
  let body='';for await(const chunk of req)body+=chunk;
  let data;try{data=JSON.parse(body)}catch{return json(400,{error:'Invalid JSON'})}
  if(!Object.hasOwn(users,data?.username)||data.password!=='Demo123!')return json(401,{error:'Invalid credentials'});
  const sid=randomUUID();sessions.set(sid,users[data.username]);res.setHeader('Set-Cookie',`sid=${sid}; HttpOnly; SameSite=Strict; Path=/`);return json(200,{role:users[data.username]});
 }
 if(path==='/api/employees' && req.method==='GET'){
  if(!role)return json(401,{error:'Unauthorized'});if(role!=='admin')return json(403,{error:'Forbidden'});return json(200,employees);
 }
 if(path==='/health')return json(200,{status:'ok'});
 if(path==='/') {res.setHeader('Content-Type','text/html; charset=utf-8');return res.end(`<!doctype html><html lang="th"><meta charset="utf-8"><title>HRMS Demo</title><h1>HRMS Demo</h1><form><label>Username <input name="username" required></label><label>Password <input name="password" type="password" required></label><button>Login</button></form><p role="status"></p><script>document.querySelector('form').onsubmit=async e=>{e.preventDefault();const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(e.target)))});document.querySelector('[role=status]').textContent=r.ok?'Login successful':'Invalid credentials';};</script></html>`);}
 json(404,{error:'Not found'});
}).listen(3000,'127.0.0.1');
