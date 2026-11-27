# แผนการทดสอบ HRMS
วัตถุประสงค์: ตรวจสอบความถูกต้องของฟังก์ชัน ข้อมูล และสิทธิ์ผู้ใช้

ขอบเขต: Login/Logout, Employee CRUD, Leave Management, Role & Session Expiry, Reports/CSV Export และ Boundary Value Analysis (รวม 54 กรณีทดสอบบนระบบจำลอง Localhost)

แนวทาง: Functional, Smoke, Regression, Exploratory, API, SQL และการตรวจสอบสิทธิ์

สภาพแวดล้อม: localhost, Chromium, SQLite แยกจากข้อมูลของแอป

เกณฑ์เริ่ม: ระบบพร้อมใช้งานและข้อมูลทดสอบพร้อม เกณฑ์จบ: กรณีสำคัญผ่าน ไม่มี defect ระดับ Critical ที่ยังเปิดอยู่ และมีรายงานผลจริง

ความเสี่ยง: ขอบเขตระบบจำลองจำกัด ข้อมูลไม่ใช่ production และผล performance ไม่สามารถใช้แทนระบบจริง
