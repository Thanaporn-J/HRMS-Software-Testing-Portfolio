# Performance Testing
รัน `jmeter -n -t performance/local.jmx -l results.jtl` หลังเปิดแอป ใช้ 5 virtual users คนละ 10 requests ตรวจ error rate และ p95 เป้าหมายตัวอย่าง error rate 0% และ p95 ไม่เกิน 500 ms ยังไม่ใช่ SLA จริง
