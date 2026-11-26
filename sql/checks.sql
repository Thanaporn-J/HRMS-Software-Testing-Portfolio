-- ตรวจจำนวนพนักงาน: คาดหวัง 2
SELECT COUNT(*) AS employee_count FROM employees;
-- ตรวจข้อมูลตามแผนก: คาดหวัง Somchai
SELECT * FROM employees WHERE department='IT';
-- ตรวจยอดวันลาที่อนุมัติ: คาดหวัง 2
SELECT SUM(days) AS approved_days FROM leave_requests WHERE status='Approved';
-- ตรวจความสัมพันธ์: คาดหวัง 2 แถว
SELECT e.name,l.days,l.status FROM employees e JOIN leave_requests l ON e.id=l.employee_id;
-- ตรวจ orphan: คาดหวัง 0 แถว
SELECT l.* FROM leave_requests l LEFT JOIN employees e ON e.id=l.employee_id WHERE e.id IS NULL;
-- ตรวจข้อมูลซ้ำ: คาดหวัง 0 แถว
SELECT name,department,COUNT(*) FROM employees GROUP BY name,department HAVING COUNT(*)>1;
