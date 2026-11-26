const {test,expect}=require('@playwright/test');
for(const [username,password,message] of [['admin','Demo123!','Login successful'],['staff','Demo123!','Login successful'],['admin','wrong','Invalid credentials'],['unknown','Demo123!','Invalid credentials']]){
 test(`Login ${username} ${message}`,async({page})=>{await page.goto('/');await page.getByLabel('Username').fill(username);await page.getByLabel('Password').fill(password);await page.getByRole('button',{name:'Login'}).click();await expect(page.getByRole('status')).toHaveText(message);});
}
test('ไม่เข้าสู่ระบบต้องได้ 401',async({request})=>{expect((await request.get('/api/employees')).status()).toBe(401);});
for(const [username,status] of [['admin',200],['staff',403]]){
 test(`สิทธิ์ ${username}`,async({request})=>{expect((await request.post('/api/login',{data:{username,password:'Demo123!'}})).status()).toBe(200);const r=await request.get('/api/employees');expect(r.status()).toBe(status);if(status===200)expect(await r.json()).toHaveLength(2);});
}
