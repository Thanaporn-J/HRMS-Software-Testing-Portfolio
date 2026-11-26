# HRMS Software Testing Portfolio

![Playwright](https://img.shields.io/badge/Playwright-Automation-2EAD33)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Postman](https://img.shields.io/badge/Postman-API-FF6C37)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57)
![JMeter](https://img.shields.io/badge/JMeter-Performance-D22128)
![Node.js](https://img.shields.io/badge/Node.js-339933)

## 📌 ภาพรวมโปรเจกต์ (Project Overview)

โปรเจกต์ส่วนตัวสำหรับฝึกทดสอบระบบบริหารทรัพยากรบุคคล (Human Resource Management System: HRMS) โดยจำลองกระบวนการทำงานของ Software Tester ตั้งแต่การวิเคราะห์ความต้องการของระบบ การออกแบบกรณีทดสอบ ไปจนถึงการจัดทำรายงานผลการทดสอบ

โปรเจกต์นี้ใช้ข้อมูลจำลองและไม่เกี่ยวข้องกับข้อมูลของนายจ้าง

## 🎯 วัตถุประสงค์ (Objectives)

- ฝึกวิเคราะห์ Requirement และออกแบบ Test Case
- ฝึกทดสอบระบบด้วย Manual และ Automation Testing
- ฝึกใช้ SQL สำหรับตรวจสอบข้อมูลในฐานข้อมูล
- ฝึกทดสอบ API ด้วย Postman
- ฝึกทดสอบประสิทธิภาพและความปลอดภัยของระบบ
- ฝึกจัดทำเอกสารและรายงานข้อผิดพลาดตามกระบวนการ Software Testing

## 🛠️ เครื่องมือที่ใช้ (Tools & Technologies)

| เครื่องมือ | วัตถุประสงค์ |
|---|---|
| Playwright | Automation Testing |
| JavaScript | เขียน Automation Test Script |
| Postman | API Testing |
| SQLite | Database Testing |
| Apache JMeter | Performance Testing |
| Node.js | ระบบ HRMS จำลอง |
| GitHub | Version Control |
| Visual Studio Code | Source Code Editor |

## 📊 ขอบเขตการทดสอบ (Testing Scope)

| ประเภทการทดสอบ | รายละเอียด |
|---|---|
| Functional Testing | ตรวจสอบการทำงานตาม Requirement |
| Regression Testing | ตรวจสอบผลกระทบหลังแก้ไขระบบ |
| Smoke Testing | ตรวจสอบฟังก์ชันหลักของระบบ |
| Negative Testing | ตรวจสอบข้อมูลและเงื่อนไขที่ไม่ถูกต้อง |
| Automation Testing | ทดสอบอัตโนมัติด้วย Playwright |
| Database Testing | ตรวจสอบข้อมูลด้วย SQL |
| API Testing | ตรวจสอบ Request, Response และ Status Code |
| Performance Testing | ตรวจสอบประสิทธิภาพบน Localhost |
| Security Testing | ตรวจสอบ Authentication และ Authorization |

## 📂 เอกสารและผลงาน (Project Deliverables)

| ผลงาน | รายละเอียด | เอกสาร |
|---|---|---|
| Test Plan | แผนการทดสอบระบบ | [View](manual/Test-Plan.md) |
| Test Cases | กรณีทดสอบระบบ | [View](manual/Test-Cases.csv) |
| Bug Report | ตัวอย่างการรายงานข้อผิดพลาด | [View](manual/Bug-Report.md) |
| Automation Testing | Playwright Test Script | [View](automation/) |
| SQL Testing | Database และ SQL Queries | [View](sql/) |
| API Testing | Postman Collection | [View](api/) |
| Performance Testing | JMeter Test Plan | [View](performance/) |
| Security Testing | Security Checklist | [View](security/) |
| Test Summary Report | แบบรายงานผลการทดสอบ | [View](report/) |

## 🧩 โมดูลที่ออกแบบกรณีทดสอบ

| Module | รายละเอียด |
|---|---|
| Login | การเข้าสู่ระบบ |
| Employee Management | การจัดการข้อมูลพนักงาน |
| Leave Management | การจัดการวันลา |
| User Roles | การกำหนดสิทธิ์ผู้ใช้งาน |
| Reports | การแสดงผลรายงาน |

ระบบจำลองปัจจุบันรองรับ Login และการอ่านข้อมูลพนักงาน ส่วนโมดูลอื่นเป็นกรณีทดสอบที่ออกแบบไว้สำหรับพัฒนาต่อยอด

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
HRMS-Software-Testing-Portfolio/
├── api/
├── automation/
├── manual/
├── performance/
├── report/
├── security/
├── sql/
├── app.js
├── package.json
├── playwright.config.js
└── README.md
```

## 🚀 การติดตั้งและเริ่มใช้งาน

ติดตั้ง Node.js เวอร์ชัน 18 ขึ้นไป โดยแนะนำให้ใช้เวอร์ชัน LTS ที่ยังได้รับการสนับสนุน

เปิด Terminal ภายในโฟลเดอร์โปรเจกต์

```bash
npm install
npx playwright install chromium
```

### เปิดระบบ HRMS จำลอง

```bash
npm start
```

เปิดเว็บไซต์ http://localhost:3000

### บัญชีสำหรับทดสอบระบบจำลอง

| Role | Username | Password |
|---|---|---|
| Admin | admin | Demo123! |
| Staff | staff | Demo123! |

บัญชีดังกล่าวเป็นบัญชีจำลองสำหรับทดสอบเท่านั้น

### 🤖 Automation Testing

```bash
npm test
```

### 🗄️ SQL Testing

```bash
sqlite3 hrms.db < sql/setup.sql
sqlite3 -header -column hrms.db < sql/checks.sql
```

### 🔗 API Testing

1. เปิดระบบจำลองด้วย npm start
2. เปิดโปรแกรม Postman
3. Import ไฟล์ api/HRMS.postman_collection.json
4. Run Collection

### ⚡ Performance Testing

1. เปิดระบบจำลอง
2. เปิด Apache JMeter
3. เปิดไฟล์ performance/local.jmx
4. ทดสอบเฉพาะระบบ Localhost

## 📋 สถานะการทดสอบ (Test Execution Status)

| รายการ | สถานะ |
|---|---|
| Test Plan | จัดทำแล้ว |
| Test Cases | ออกแบบแล้ว |
| Bug Report | ตัวอย่างสถานการณ์สมมติ |
| Automation Script | จัดทำแล้ว รอทดสอบ |
| SQL Queries | จัดทำแล้ว |
| API Collection | จัดทำแล้ว รอทดสอบ |
| Performance Test | จัดทำแล้ว รอทดสอบ |
| Test Summary Report | รอบันทึกผลจริง |

ยังไม่มีการสรุปผล Pass หรือ Fail จนกว่าจะดำเนินการทดสอบจริง

## 👩‍💻 ผู้จัดทำ (Portfolio Owner)

**Thanaporn Jindamanee**

Software Tester

- Manual Testing
- Test Case Design
- Defect Management
- Automation Testing
- SQL & API Testing

GitHub: [Thanaporn-J](https://github.com/Thanaporn-J)

---

Personal Software Testing Portfolio | HRMS Testing Project
