# ตัวอย่าง Bug Report (สมมติ)

ID: SAMPLE-001 | Severity: High | Priority: High

หัวข้อ: พนักงานทั่วไปสามารถดูข้อมูลพนักงานทั้งหมดได้

ขั้นตอน: เข้าสู่ระบบด้วย staff แล้วเรียก GET /api/employees

Expected: HTTP 403

Actual (สมมติ): HTTP 200

สถานะ: ตัวอย่างเท่านั้น ไม่ใช่ defect ที่พบจริง
