PRAGMA foreign_keys=ON;
DROP TABLE IF EXISTS leave_requests;
DROP TABLE IF EXISTS employees;
CREATE TABLE employees(id INTEGER PRIMARY KEY,name TEXT NOT NULL,department TEXT NOT NULL);
CREATE TABLE leave_requests(id INTEGER PRIMARY KEY,employee_id INTEGER NOT NULL REFERENCES employees(id),days INTEGER CHECK(days>0),status TEXT CHECK(status IN ('Pending','Approved','Rejected')));
INSERT INTO employees VALUES(1,'Somchai','IT'),(2,'Suda','HR');
INSERT INTO leave_requests VALUES(1,1,2,'Approved'),(2,2,1,'Pending');
