# Bug Report (รายงานข้อผิดพลาด)

## 🔴 Defect ที่พบจริงจากการทดสอบ Boundary Value Analysis

### BUG-001: ระบบยอมให้สร้างพนักงานด้วยรหัส `id <= 0` ได้
- **ID:** BUG-001 | **Related Test Case:** `BVA-03`
- **Severity:** High | **Priority:** High | **Status:** Open
- **Environment:** Localhost (`node app.js`), Playwright API Test
- **Steps to Reproduce:**
  1. เข้าสู่ระบบด้วยบัญชี `admin` (`POST /api/login`)
  2. ส่งคำขอ `POST /api/employees` ด้วยข้อมูล `{"id": 0, "name": "Zero ID", "department": "IT"}`
- **Expected Result:** ระบบปฏิเสธและตอบกลับ `HTTP 400 Bad Request` เนื่องจากรหัสพนักงานต้องเป็นจำนวนเต็มบวก (`>= 1`)
- **Actual Result:** ระบบตอบกลับ `HTTP 201 Created` และบันทึกพนักงานรหัส `0` ลงในระบบ

---

### BUG-002: ระบบยอมให้ยื่นคำขอลางานย้อนหลังในอดีตได้
- **ID:** BUG-002 | **Related Test Case:** `BVA-04`
- **Severity:** Medium | **Priority:** Medium | **Status:** Open
- **Environment:** Localhost (`node app.js`), Playwright API Test
- **Steps to Reproduce:**
  1. เข้าสู่ระบบด้วยบัญชี `staff` (`POST /api/login`)
  2. ส่งคำขอ `POST /api/leaves` ด้วยข้อมูล `{"startDate": "2020-01-01", "endDate": "2020-01-01", "type": "Annual"}`
- **Expected Result:** ระบบปฏิเสธและตอบกลับ `HTTP 400 Bad Request` เนื่องจากเป็นวันลาในอดีต
- **Actual Result:** ระบบตอบกลับ `HTTP 201 Created` และสร้างใบลาสถานะ `Pending` ให้วันที่ในอดีตได้

---

## 📝 ตัวอย่าง Bug Report (สถานการณ์สมมติ)

- **ID:** SAMPLE-001 | **Severity:** High | **Priority:** High
- **หัวข้อ:** พนักงานทั่วไปสามารถดูข้อมูลพนักงานทั้งหมดได้
- **ขั้นตอน:** เข้าสู่ระบบด้วย `staff` แล้วเรียก `GET /api/employees`
- **Expected:** `HTTP 403`
- **Actual (สมมติ):** `HTTP 200`
- **สถานะ:** ตัวอย่างเท่านั้น ไม่ใช่ defect ที่พบจริง (ในการทดสอบจริง `ROLE-02` ได้ `HTTP 403` ถูกต้อง)
