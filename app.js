const http = require('node:http');
const users = {admin:'admin',staff:'staff'};
const sessions = new Map();
const employees = [{id:1,name:'Somchai',department:'IT',joinedDate:'2026-01-15'},{id:2,name:'Suda',department:'HR',joinedDate:'2026-02-20'}];
const leaveBalances = {admin:10,staff:5};
const leaveRequests = [];
let nextLeaveId = 1;
const {randomUUID}=require('node:crypto');
http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost');
 const path=url.pathname;
 const token=req.headers.cookie?.match(/(?:^|; )sid=([^;]+)/)?.[1];
 const session=sessions.get(token);
 let role,currentUser;
 if(session){
  if(session.expiresAt<=Date.now()){sessions.delete(token);}else{role=session.role;currentUser=session.username;}
 }
 const json=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));};
 if(path==='/api/login' && req.method==='POST'){
  let body='';for await(const chunk of req)body+=chunk;
  let data;try{data=JSON.parse(body)}catch{return json(400,{error:'Invalid JSON'})}
  if(!Object.hasOwn(users,data?.username)||data.password!=='Demo123!')return json(401,{error:'Invalid credentials'});
  const sid=randomUUID();
  const ttlMs=typeof data.ttlMs==='number'?data.ttlMs:3600000;
  sessions.set(sid,{username:data.username,role:users[data.username],expiresAt:Date.now()+ttlMs});
  res.setHeader('Set-Cookie',`sid=${sid}; HttpOnly; SameSite=Strict; Path=/`);return json(200,{role:users[data.username]});
 }
 if(path==='/api/logout' && req.method==='POST'){
  if(token)sessions.delete(token);
  res.setHeader('Set-Cookie','sid=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');
  return json(200,{status:'logged out'});
 }
 if(path==='/api/employees' && req.method==='GET'){
  if(!role)return json(401,{error:'Unauthorized'});if(role!=='admin')return json(403,{error:'Forbidden'});
  let list=employees;
  const idParam=url.searchParams.get('id');
  const deptParam=url.searchParams.get('department');
  if(idParam!==null)list=list.filter(e=>String(e.id)===idParam);
  if(deptParam!==null)list=list.filter(e=>e.department===deptParam);
  return json(200,list);
 }
 if(path==='/api/employees' && req.method==='POST'){
  if(!role)return json(401,{error:'Unauthorized'});if(role!=='admin')return json(403,{error:'Forbidden'});
  let body='';for await(const chunk of req)body+=chunk;
  let data;try{data=JSON.parse(body)}catch{return json(400,{error:'Invalid JSON'})}
  if(!data?.name || !String(data.name).trim())return json(400,{error:'Name is required'});
  if(employees.some(e=>e.id===data.id))return json(409,{error:'Duplicate employee ID'});
  const emp={id:data.id ?? employees.length+1,name:String(data.name).trim(),department:data.department||'General'};
  employees.push(emp);
  return json(201,emp);
 }
 const empMatch=path.match(/^\/api\/employees\/(\d+)$/);
 if(empMatch && req.method==='PUT'){
  if(!role)return json(401,{error:'Unauthorized'});if(role!=='admin')return json(403,{error:'Forbidden'});
  const id=Number(empMatch[1]);
  const emp=employees.find(e=>e.id===id);
  if(!emp)return json(404,{error:'Not found'});
  let body='';for await(const chunk of req)body+=chunk;
  let data;try{data=JSON.parse(body)}catch{return json(400,{error:'Invalid JSON'})}
  if(!data?.name || !String(data.name).trim())return json(400,{error:'Name is required'});
  emp.name=String(data.name).trim();
  if(data.department)emp.department=data.department;
  return json(200,emp);
 }
 if(empMatch && req.method==='DELETE'){
  if(!role)return json(401,{error:'Unauthorized'});if(role!=='admin')return json(403,{error:'Forbidden'});
  const id=Number(empMatch[1]);
  const idx=employees.findIndex(e=>e.id===id);
  if(idx===-1)return json(404,{error:'Not found'});
  employees.splice(idx,1);
  return json(200,{deleted:id});
 }
 const roleMatch=path.match(/^\/api\/roles\/([a-zA-Z0-9_]+)$/);
 if(roleMatch && req.method==='PUT'){
  if(!role)return json(401,{error:'Unauthorized'});if(role!=='admin')return json(403,{error:'Forbidden'});
  const targetUser=roleMatch[1];
  if(!Object.hasOwn(users,targetUser))return json(404,{error:'User not found'});
  let body='';for await(const chunk of req)body+=chunk;
  let data;try{data=JSON.parse(body)}catch{return json(400,{error:'Invalid JSON'})}
  if(!['admin','staff'].includes(data?.role))return json(400,{error:'Invalid role'});
  users[targetUser]=data.role;
  return json(200,{username:targetUser,role:users[targetUser]});
 }
 if(path==='/admin' && req.method==='GET'){
  if(!role)return json(401,{error:'Unauthorized'});if(role!=='admin')return json(403,{error:'Forbidden'});
  res.setHeader('Content-Type','text/html; charset=utf-8');return res.end('<!doctype html><html><body><h1>Admin Panel</h1></body></html>');
 }
 if(path==='/api/leaves' && req.method==='GET'){
  if(!role)return json(401,{error:'Unauthorized'});
  const items=role==='admin'?leaveRequests:leaveRequests.filter(l=>l.username===currentUser);
  return json(200,{balance:leaveBalances[currentUser]??0,leaves:items});
 }
 if(path==='/api/leaves' && req.method==='POST'){
  if(!role)return json(401,{error:'Unauthorized'});
  let body='';for await(const chunk of req)body+=chunk;
  let data;try{data=JSON.parse(body)}catch{return json(400,{error:'Invalid JSON'})}
  if(!data?.type || !String(data.type).trim())return json(400,{error:'Leave type is required'});
  const start=new Date(data.startDate),end=new Date(data.endDate);
  if(Number.isNaN(start.getTime())||Number.isNaN(end.getTime())||end<start)return json(400,{error:'Invalid date range'});
  const days=Math.floor((end-start)/86400000)+1;
  if(days>(leaveBalances[currentUser]??0))return json(400,{error:'Insufficient leave balance'});
  const overlap=leaveRequests.some(l=>l.username===currentUser && !['Rejected','Cancelled'].includes(l.status) && data.startDate<=l.endDate && data.endDate>=l.startDate);
  if(overlap)return json(409,{error:'Overlapping leave dates'});
  const leave={id:nextLeaveId++,username:currentUser,startDate:data.startDate,endDate:data.endDate,days,type:String(data.type).trim(),status:'Pending'};
  leaveRequests.push(leave);
  return json(201,leave);
 }
 const leaveAction=path.match(/^\/api\/leaves\/(\d+)\/(approve|reject|cancel)$/);
 if(leaveAction && req.method==='PUT'){
  if(!role)return json(401,{error:'Unauthorized'});
  const id=Number(leaveAction[1]),action=leaveAction[2];
  const leave=leaveRequests.find(l=>l.id===id);
  if(!leave)return json(404,{error:'Leave not found'});
  if((action==='approve'||action==='reject') && role!=='admin')return json(403,{error:'Forbidden'});
  if(action==='cancel' && role!=='admin' && leave.username!==currentUser)return json(403,{error:'Forbidden'});
  if(leave.status!=='Pending')return json(400,{error:'Leave is not pending'});
  if(action==='approve'){leave.status='Approved';leaveBalances[leave.username]=(leaveBalances[leave.username]??0)-leave.days;}
  if(action==='reject'){leave.status='Rejected';}
  if(action==='cancel'){leave.status='Cancelled';}
  return json(200,{leave,balance:leaveBalances[leave.username]});
 }
 if(path==='/api/reports/employees' && req.method==='GET'){
  if(!role)return json(401,{error:'Unauthorized'});if(role!=='admin')return json(403,{error:'Forbidden'});
  const dept=url.searchParams.get('department');
  const startDate=url.searchParams.get('startDate');
  const endDate=url.searchParams.get('endDate');
  const format=url.searchParams.get('format');
  if(startDate && endDate && endDate<startDate)return json(400,{error:'Invalid date range'});
  let list=employees;
  if(dept)list=list.filter(e=>e.department===dept);
  if(startDate)list=list.filter(e=>(e.joinedDate||'')>=startDate);
  if(endDate)list=list.filter(e=>(e.joinedDate||'')<=endDate);
  if(format==='csv'){
   const header='id,name,department,joinedDate';
   const rows=list.map(e=>`${e.id},${e.name},${e.department},${e.joinedDate||''}`);
   res.writeHead(200,{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="employees.csv"'});
   return res.end('\uFEFF'+[header,...rows].join('\n'));
  }
  return json(200,{total:list.length,items:list});
 }
 if(path==='/health')return json(200,{status:'ok'});
 if(path==='/') {res.setHeader('Content-Type','text/html; charset=utf-8');return res.end(`<!doctype html><html lang="th"><meta charset="utf-8"><title>HRMS Demo</title><h1>HRMS Demo</h1><form><label>Username <input name="username" required></label><label>Password <input name="password" type="password" required></label><button>Login</button></form><p role="status"></p><script>document.querySelector('form').onsubmit=async e=>{e.preventDefault();const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(e.target)))});document.querySelector('[role=status]').textContent=r.ok?'Login successful':'Invalid credentials';};</script></html>`);}
 json(404,{error:'Not found'});
}).listen(3000,'127.0.0.1');
