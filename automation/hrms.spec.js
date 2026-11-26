const { test, expect } = require('@playwright/test');

// LOGIN-01, LOGIN-02, LOGIN-03, LOGIN-04, LOGIN-07
for (const [username, password, message] of [
  ['admin', 'Demo123!', 'Login successful'],
  ['staff', 'Demo123!', 'Login successful'],
  ['admin', 'wrong', 'Invalid credentials'],
  ['unknown', 'Demo123!', 'Invalid credentials'],
  ['ADMIN', 'Demo123!', 'Invalid credentials'],
]) {
  test(`Login ${username} ${message}`, async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('status')).toHaveText(message);
  });
}

// LOGIN-05, LOGIN-06: HTML5 required field validation
test('LOGIN-05 ชื่อผู้ใช้ว่างต้องแจ้งกรอกข้อมูล', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Password').fill('Demo123!');
  await page.getByRole('button', { name: 'Login' }).click();
  const isMissing = await page.getByLabel('Username').evaluate((el) => el.validity.valueMissing);
  expect(isMissing).toBe(true);
  await expect(page.getByRole('status')).toHaveText('');
});

test('LOGIN-06 รหัสผ่านว่างต้องแจ้งกรอกข้อมูล', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Username').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  const isMissing = await page.getByLabel('Password').evaluate((el) => el.validity.valueMissing);
  expect(isMissing).toBe(true);
  await expect(page.getByRole('status')).toHaveText('');
});

// LOGIN-08: Malformed JSON returns 400
test('LOGIN-08 ส่ง JSON ไม่ถูกต้องต้องได้ 400', async ({ request }) => {
  const res = await request.post('/api/login', {
    headers: { 'Content-Type': 'application/json' },
    data: Buffer.from('{invalid-json'),
  });
  expect(res.status()).toBe(400);
});

// LOGIN-09: Password input is masked
test('LOGIN-09 รหัสผ่านต้องถูกซ่อนเป็นอักขระปิดบัง', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel('Password')).toHaveAttribute('type', 'password');
});

// ROLE-01: Unauthenticated access returns 401
test('ROLE-01 ไม่เข้าสู่ระบบต้องได้ 401', async ({ request }) => {
  expect((await request.get('/api/employees')).status()).toBe(401);
});

// ROLE-02, ROLE-03, EMPLOYEE-09: Role-based access control
for (const [username, status] of [
  ['admin', 200],
  ['staff', 403],
]) {
  test(`สิทธิ์ ${username}`, async ({ request }) => {
    expect((await request.post('/api/login', { data: { username, password: 'Demo123!' } })).status()).toBe(200);
    const r = await request.get('/api/employees');
    expect(r.status()).toBe(status);
    if (status === 200) expect(await r.json()).toHaveLength(2);
  });
}

// ROLE-04: Invalid session cookie returns 401
test('ROLE-04 cookie ปลอมต้องได้ 401', async ({ request }) => {
  const res = await request.get('/api/employees', {
    headers: { Cookie: 'sid=invalid' },
  });
  expect(res.status()).toBe(401);
});

// ROLE-05, ROLE-06: Session cookie security flags
test('ROLE-05 & ROLE-06 ตรวจ Set-Cookie มี HttpOnly และ SameSite=Strict', async ({ request }) => {
  const res = await request.post('/api/login', {
    data: { username: 'admin', password: 'Demo123!' },
  });
  expect(res.status()).toBe(200);
  const setCookie = res.headers()['set-cookie'] || '';
  expect(setCookie).toContain('HttpOnly');
  expect(setCookie).toContain('SameSite=Strict');
});

// LOGIN-10: Logout invalidates session
test('LOGIN-10 ออกจากระบบแล้ว session ต้องถูกยกเลิก (ได้ 401)', async ({ request }) => {
  expect((await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } })).status()).toBe(200);
  expect((await request.post('/api/logout')).status()).toBe(200);
  expect((await request.get('/api/employees')).status()).toBe(401);
});

// EMPLOYEE-01, EMPLOYEE-02, EMPLOYEE-03: Create employee validation
test('EMPLOYEE-01 เพิ่มพนักงานใหม่สำเร็จ (ได้ 201)', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const res = await request.post('/api/employees', { data: { id: 3, name: 'Anan', department: 'Finance' } });
  expect(res.status()).toBe(201);
  expect((await res.json()).name).toBe('Anan');
});

test('EMPLOYEE-02 เพิ่มรหัสพนักงานซ้ำต้องถูกปฏิเสธ (ได้ 409)', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const res = await request.post('/api/employees', { data: { id: 1, name: 'Duplicate', department: 'IT' } });
  expect(res.status()).toBe(409);
});

test('EMPLOYEE-03 ชื่อพนักงานว่างต้องแจ้งข้อมูลจำเป็น (ได้ 400)', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const res = await request.post('/api/employees', { data: { id: 4, name: '', department: 'IT' } });
  expect(res.status()).toBe(400);
});

test('EMPLOYEE-04 แก้ไขชื่อพนักงานสำเร็จ (PUT ได้ 200)', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const res = await request.put('/api/employees/3', { data: { name: 'Anan Updated' } });
  expect(res.status()).toBe(200);
  expect((await res.json()).name).toBe('Anan Updated');
});

test('EMPLOYEE-05 ค้นหารหัสที่มีต้องพบพนักงาน', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const res = await request.get('/api/employees?id=1');
  expect(res.status()).toBe(200);
  const list = await res.json();
  expect(list).toHaveLength(1);
  expect(list[0].name).toBe('Somchai');
});

test('EMPLOYEE-06 ค้นหารหัสที่ไม่มีต้องแสดงรายการว่าง', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const res = await request.get('/api/employees?id=999');
  expect(res.status()).toBe(200);
  expect(await res.json()).toHaveLength(0);
});

test('EMPLOYEE-07 กรองแผนก IT ต้องแสดงเฉพาะ IT', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const res = await request.get('/api/employees?department=IT');
  expect(res.status()).toBe(200);
  const list = await res.json();
  expect(list.length).toBeGreaterThan(0);
  expect(list.every((e) => e.department === 'IT')).toBe(true);
});

test('EMPLOYEE-08 ลบพนักงานแล้วต้องไม่พบหลังลบ (DELETE ได้ 200)', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  expect((await request.delete('/api/employees/3')).status()).toBe(200);
  const after = await request.get('/api/employees?id=3');
  expect(await after.json()).toHaveLength(0);
});

test('EMPLOYEE-10 บันทึกและแสดงชื่อภาษาไทยได้ถูกต้อง', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const create = await request.post('/api/employees', { data: { id: 10, name: 'สมหญิง ใจดี', department: 'HR' } });
  expect(create.status()).toBe(201);
  const read = await request.get('/api/employees?id=10');
  expect((await read.json())[0].name).toBe('สมหญิง ใจดี');
  await request.delete('/api/employees/10');
});

// ROLE-07, ROLE-08, ROLE-09, ROLE-10: Role management & session expiration
test('ROLE-07 admin เปลี่ยนสิทธิ์ผู้ใช้สำเร็จ (ได้ 200)', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const res = await request.put('/api/roles/staff', { data: { role: 'admin' } });
  expect(res.status()).toBe(200);
  expect((await res.json()).role).toBe('admin');
  // คืนค่าสิทธิ์ staff กลับเหมือนเดิม
  await request.put('/api/roles/staff', { data: { role: 'staff' } });
});

test('ROLE-08 staff แอบแก้ไขสิทธิ์ต้องถูกปฏิเสธ (ได้ 403)', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'staff', password: 'Demo123!' } });
  const res = await request.put('/api/roles/staff', { data: { role: 'admin' } });
  expect(res.status()).toBe(403);
});

test('ROLE-09 ใช้ session หมดอายุต้องถูกปฏิเสธ (ได้ 401)', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!', ttlMs: -1 } });
  const res = await request.get('/api/employees');
  expect(res.status()).toBe(401);
});

test('ROLE-10 staff แอบเปิดหน้า admin ต้องถูกปฏิเสธ (ได้ 403)', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'staff', password: 'Demo123!' } });
  const res = await request.get('/admin');
  expect(res.status()).toBe(403);
});

// LEAVE-01..10: Leave management
test('LEAVE-01 ยื่นวันลาในอนาคตสำเร็จ (ได้ 201 Pending)', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'staff', password: 'Demo123!' } });
  const res = await request.post('/api/leaves', { data: { startDate: '2026-12-01', endDate: '2026-12-01', type: 'Annual' } });
  expect(res.status()).toBe(201);
  expect((await res.json()).status).toBe('Pending');
});

test('LEAVE-02 วันสิ้นสุดก่อนวันเริ่มต้องถูกปฏิเสธ (ได้ 400)', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'staff', password: 'Demo123!' } });
  const res = await request.post('/api/leaves', { data: { startDate: '2026-12-10', endDate: '2026-12-08', type: 'Annual' } });
  expect(res.status()).toBe(400);
});

test('LEAVE-03 ลาเกินสิทธิ์ต้องถูกปฏิเสธ (ได้ 400)', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'staff', password: 'Demo123!' } });
  const res = await request.post('/api/leaves', { data: { startDate: '2026-12-10', endDate: '2026-12-20', type: 'Annual' } });
  expect(res.status()).toBe(400);
});

test('LEAVE-04 ไม่ระบุประเภทการลาต้องแจ้งข้อมูลจำเป็น (ได้ 400)', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'staff', password: 'Demo123!' } });
  const res = await request.post('/api/leaves', { data: { startDate: '2026-12-15', endDate: '2026-12-15', type: '' } });
  expect(res.status()).toBe(400);
});

test('LEAVE-08 ลาซ้ำช่วงวันเดิมต้องถูกปฏิเสธ (ได้ 409)', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'staff', password: 'Demo123!' } });
  const res = await request.post('/api/leaves', { data: { startDate: '2026-12-01', endDate: '2026-12-01', type: 'Sick' } });
  expect(res.status()).toBe(409);
});

test('LEAVE-05 & LEAVE-10 อนุมัติใบลา 1 วัน สถานะเป็น Approved และยอดวันลาลดจาก 5 เหลือ 4', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const res = await request.put('/api/leaves/1/approve');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.leave.status).toBe('Approved');
  expect(body.balance).toBe(4);
});

test('LEAVE-06 ปฏิเสธใบลาสถานะต้องเป็น Rejected', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'staff', password: 'Demo123!' } });
  const created = await (await request.post('/api/leaves', { data: { startDate: '2026-12-02', endDate: '2026-12-02', type: 'Sick' } })).json();
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const res = await request.put(`/api/leaves/${created.id}/reject`);
  expect(res.status()).toBe(200);
  expect((await res.json()).leave.status).toBe('Rejected');
});

test('LEAVE-07 ยกเลิกคำขอที่รออนุมัติสถานะต้องเป็น Cancelled', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'staff', password: 'Demo123!' } });
  const created = await (await request.post('/api/leaves', { data: { startDate: '2026-12-03', endDate: '2026-12-03', type: 'Personal' } })).json();
  const res = await request.put(`/api/leaves/${created.id}/cancel`);
  expect(res.status()).toBe(200);
  expect((await res.json()).leave.status).toBe('Cancelled');
});

test('LEAVE-09 พนักงานดูประวัติการลาต้องแสดงเฉพาะของตนเอง', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'staff', password: 'Demo123!' } });
  const res = await request.get('/api/leaves');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.leaves.length).toBeGreaterThan(0);
  expect(body.leaves.every((l) => l.username === 'staff')).toBe(true);
});

// REPORT-01..10: Reports & CSV Export
test('REPORT-01 & REPORT-10 รายงานพนักงานต้องตรงฐานข้อมูลและยอดรวมตรงกับจำนวนรายการ', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const res = await request.get('/api/reports/employees');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.total).toBe(2);
  expect(body.items).toHaveLength(body.total);
});

test('REPORT-02 กรองรายงานตามแผนก IT ต้องแสดงเฉพาะ IT', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const res = await request.get('/api/reports/employees?department=IT');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.total).toBe(1);
  expect(body.items[0].department).toBe('IT');
});

test('REPORT-03 กรองรายงานตามช่วงวันที่มีข้อมูลต้องตรงช่วง', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const res = await request.get('/api/reports/employees?startDate=2026-01-01&endDate=2026-01-31');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.total).toBe(1);
  expect(body.items[0].name).toBe('Somchai');
});

test('REPORT-04 กรองช่วงวันผิด (วันสิ้นสุดก่อนวันเริ่ม) ต้องได้ 400', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const res = await request.get('/api/reports/employees?startDate=2026-03-01&endDate=2026-01-01');
  expect(res.status()).toBe(400);
});

test('REPORT-05 & REPORT-06 ส่งออก CSV ต้องเปิดได้และหัวคอลัมน์ถูกต้อง', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const res = await request.get('/api/reports/employees?format=csv');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('text/csv');
  const text = (await res.text()).replace(/^\uFEFF/, '');
  expect(text.split('\n')[0]).toBe('id,name,department,joinedDate');
});

test('REPORT-07 ส่งออก CSV ชื่อภาษาไทยต้องอักขระไม่เสีย', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  await request.post('/api/employees', { data: { id: 20, name: 'สมชาย ภาษาไทย', department: 'HR' } });
  const res = await request.get('/api/reports/employees?format=csv');
  expect(res.status()).toBe(200);
  const text = await res.text();
  expect(text).toContain('สมชาย ภาษาไทย');
  await request.delete('/api/employees/20');
});

test('REPORT-08 ตัวกรองไม่พบข้อมูลต้องแสดงรายการว่าง', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const res = await request.get('/api/reports/employees?department=NonExistent');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.total).toBe(0);
  expect(body.items).toHaveLength(0);
});

test('REPORT-09 staff แอบเปิดรายงาน admin ต้องถูกปฏิเสธ (ได้ 403)', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'staff', password: 'Demo123!' } });
  const res = await request.get('/api/reports/employees');
  expect(res.status()).toBe(403);
});

// BVA-01..04: Boundary Value Analysis (รวม Known Defects ที่พบจริง)
test('BVA-01 ขอบเขตวันลา: ลาเกินสิทธิ์ 1 วัน (11 วัน) ต้องได้ 400 และลาพอดีสิทธิ์ (10 วัน) ต้องได้ 201', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  // admin มีสิทธิ์ 10 วัน -> ขอบบน+1 (11 วัน) ต้องปฏิเสธ 400
  const over = await request.post('/api/leaves', { data: { startDate: '2026-12-01', endDate: '2026-12-11', type: 'Annual' } });
  expect(over.status()).toBe(400);
  // ขอบบนพอดีเป๊ะ (10 วัน) ต้องผ่าน 201
  const exact = await request.post('/api/leaves', { data: { startDate: '2026-12-01', endDate: '2026-12-10', type: 'Annual' } });
  expect(exact.status()).toBe(201);
});

test('BVA-02 ขอบเขตชื่อพนักงาน: ช่องว่างล้วน "   " ต้องถูกปฏิเสธ (ได้ 400)', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const res = await request.post('/api/employees', { data: { id: 30, name: '   ', department: 'IT' } });
  expect(res.status()).toBe(400);
});

// BUG-001 (Open): ระบบยังยอมรับรหัสพนักงาน id <= 0 (คืน 201 แทน 400)
test.fail('BVA-03 [BUG-001] ขอบเขตรหัสพนักงาน: id = 0 หรือติดลบต้องถูกปฏิเสธ (คาดหวัง 400)', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'admin', password: 'Demo123!' } });
  const res = await request.post('/api/employees', { data: { id: 0, name: 'Zero ID', department: 'IT' } });
  expect(res.status()).toBe(400);
});

// BUG-002 (Open): ระบบยังยอมรับวันลาในอดีต (คืน 201 แทน 400)
test.fail('BVA-04 [BUG-002] ขอบเขตวันที่ลา: ยื่นวันลาในอดีต (2020-01-01) ต้องถูกปฏิเสธ (คาดหวัง 400)', async ({ request }) => {
  await request.post('/api/login', { data: { username: 'staff', password: 'Demo123!' } });
  const res = await request.post('/api/leaves', { data: { startDate: '2020-01-01', endDate: '2020-01-01', type: 'Annual' } });
  expect(res.status()).toBe(400);
});








