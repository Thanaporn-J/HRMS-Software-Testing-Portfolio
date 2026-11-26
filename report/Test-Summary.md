# Test Summary Report

- **วันที่ทดสอบ:** 2026-11-26
- **สภาพแวดล้อม:** Linux (Ubuntu 24.04), Node.js 22, Playwright (`@playwright/test` ^1.51.1) + Chromium, SQLite (`sqlite3`)
- **ขอบเขตที่ทดสอบจริง:** ครบทั้ง 5 โมดูล (Login, Employee, Leave, Role, Report) + Boundary Value Analysis (BVA) รวม 54 กรณีทดสอบ, Security Checklist, SQL Checks และ Performance Smoke Load

| รายการ | จำนวน |
|---|---:|
| กรณีทดสอบที่ออกแบบทั้งหมด | 54 |
| Pass | 52 |
| Fail (Known Defects) | 2 |
| Not Run | 0 |

## Defect ที่พบจริงและยังเปิดอยู่ (Open Defects)

| Bug ID | Test Case | รายละเอียด | Severity | สถานะ |
|---|---|---|---|---|
| `BUG-001` | `BVA-03` | ระบบยอมให้สร้างพนักงานด้วย `id <= 0` (ได้ `201` แทน `400`) | High | Open |
| `BUG-002` | `BVA-04` | ระบบยอมให้ยื่นวันลาย้อนหลังในอดีต `2020-01-01` (ได้ `201` แทน `400`) | Medium | Open |

*(ดูรายละเอียดและขั้นตอนการทำซ้ำใน `manual/Bug-Report.md`)*

## หลักฐานผลการทดสอบจริง
- **Playwright Automation (`npm test`):** รันทั้งหมด `49` test cases (4.9s) — ผ่าน `47` ข้อ และยืนยัน Known Defects `2` ข้อด้วย `test.fail()` (`BVA-03 [BUG-001]`, `BVA-04 [BUG-002]`) ครอบคลุมครบ `54/54` กรณีใน `manual/Test-Cases.csv`
- **Security Checklist (`security/Checklist.md`):** ผ่านครบ `5/5` รายการ (401 ไม่ล็อกอิน, 403 staff, 200 admin, 401 cookie ปลอม, และตรวจพบ `HttpOnly` + `SameSite=Strict`)
- **SQL Testing (`sql/checks.sql`):** ผ่านครบ `6/6` คำสั่ง (`employee_count = 2`, แผนก IT = `Somchai`, `approved_days = 2`, `JOIN = 2 แถว`, orphan = `0`, duplicate = `0`)
- **Performance Smoke Load (5 virtual users × 10 loops, ramp-up 5s, `GET /health`):**
  - Total Requests: `50`
  - Error Rate: `0.00%` (เป้าหมาย `0%`)
  - Latency: Min `0.19 ms`, Avg `2.90 ms`, **p95 `4.32 ms`** (เป้าหมาย `<= 500 ms`), Max `67.56 ms`
