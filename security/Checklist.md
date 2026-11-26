# Security Testing (localhost)
- [x] ไม่ล็อกอินต้องได้ 401
- [x] staff ต้องได้ 403
- [x] admin ต้องได้ 200
- [x] cookie ปลอมต้องได้ 401
- [x] ตรวจ HttpOnly และ SameSite

ระบบจำลองไม่เหมาะกับ production: ใช้ HTTP, รหัสผ่านตัวอย่าง และ session ในหน่วยความจำ ไม่มีระบบหมดอายุหรือ logout
