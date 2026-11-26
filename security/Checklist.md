# Security Testing (localhost)
- [ ] ไม่ล็อกอินต้องได้ 401
- [ ] staff ต้องได้ 403
- [ ] admin ต้องได้ 200
- [ ] cookie ปลอมต้องได้ 401
- [ ] ตรวจ HttpOnly และ SameSite

ระบบจำลองไม่เหมาะกับ production: ใช้ HTTP, รหัสผ่านตัวอย่าง และ session ในหน่วยความจำ ไม่มีระบบหมดอายุหรือ logout
