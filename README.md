# HRMS Software Testing Portfolio

โปรเจกต์ส่วนตัวสำหรับฝึกทดสอบระบบบริหารทรัพยากรบุคคล (HRMS) ด้วยข้อมูลจำลอง ไม่ใช่ผลงานจากนายจ้าง

## ขอบเขต
- Manual Testing: Login, Employee, Leave, Role และ Report
- Automation: Playwright + JavaScript
- Database: SQLite
- API: Postman
- Performance: JMeter (เฉพาะ localhost)
- Security: ตรวจสอบการยืนยันตัวตนและสิทธิ์

## เริ่มใช้งาน
ติดตั้ง Node.js 18 ขึ้นไป แล้วเปิด Terminal ในโฟลเดอร์นี้
```bash
npm install
npx playwright install chromium
npm test
```
เปิดระบบจำลองด้วย `npm start` ที่ http://localhost:3000 (บัญชี admin / Demo123! หรือ staff / Demo123!) ข้อมูลจะรีเซ็ตเมื่อเริ่มเซิร์ฟเวอร์ใหม่

SQL: ใช้ SQLite CLI: `sqlite3 hrms.db < sql/setup.sql` แล้ว `sqlite3 -header -column hrms.db < sql/checks.sql`

API: เปิดเซิร์ฟเวอร์แล้ว import `api/HRMS.postman_collection.json` ใน Postman และ Run Collection

Performance: เปิดเซิร์ฟเวอร์แล้วเปิด `performance/local.jmx` ใน JMeter; รันเฉพาะเครื่องตนเอง

## สถานะ
เอกสารเป็นแผนและกรณีทดสอบที่ออกแบบไว้ ผลจริงยังไม่บันทึก ตัวอย่าง Bug Report เป็นสถานการณ์สมมติ ไม่ใช่ข้อบกพร่องที่พบจริง ระบบจำลองมีฟังก์ชัน Login และอ่านข้อมูลพนักงานเท่านั้น กรณีอื่นเป็นแผนสำหรับ HRMS เต็มรูปแบบ
