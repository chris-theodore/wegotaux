-- Modify the CREATE TABLE statements as needed to add constraints.
-- Do not otherwise change the column names or types.
-- COLLABORATED WITH CHRIS THEODORE
CREATE TABLE People
(id INTEGER NOT NULL,
 name VARCHAR(256) NOT NULL,
 pet VARCHAR(256),
 wand_core VARCHAR(256),
 PRIMARY KEY (id)
);

CREATE TABLE Teacher
(id INTEGER NOT NULL
  PRIMARY KEY REFERENCES People(id)
);

CREATE TABLE House
(name VARCHAR(32) NOT NULL PRIMARY KEY,
 teacher_id INTEGER NOT NULL REFERENCES People(id)
);

CREATE TABLE Student
(id INTEGER NOT NULL PRIMARY KEY REFERENCES People(id),
 year INTEGER NOT NULL,
 house_name VARCHAR(32) NOT NULL REFERENCES House(name)
);

CREATE TABLE Deed
(id SERIAL PRIMARY KEY,
 student_id INTEGER NOT NULL REFERENCES People(id),
 datetime TIMESTAMP NOT NULL,
 points INTEGER NOT NULL,
 description VARCHAR(512) NOT NULL,
 CONSTRAINT deed_check CHECK((description LIKE 'Arriving late,%' AND points <=-10) OR (description NOT LIKE 'Arriving late,%'))
);

CREATE TABLE Subject
(name VARCHAR(256) NOT NULL PRIMARY KEY
);

CREATE TABLE Offering
(subject_name VARCHAR(256) NOT NULL REFERENCES Subject(name),
 year INTEGER NOT NULL,
 teacher_id INTEGER NOT NULL REFERENCES People(id),
 PRIMARY KEY(subject_name, year),
 UNIQUE(teacher_id, year)
);

CREATE TABLE Grade
(student_id INTEGER NOT NULL REFERENCES People(id),
 subject_name VARCHAR(256) NOT NULL REFERENCES Subject(name),
 year INTEGER NOT NULL,
 grade CHAR(1) CHECK(grade IN('O', 'E', 'A', 'P', 'D', 'T')),
 PRIMARY KEY(student_id, subject_name, year)
);

CREATE TABLE FavoriteSubject
(student_id INTEGER NOT NULL REFERENCES People(id),
 subject_name VARCHAR(256) NOT NULL REFERENCES Subject(name),
 PRIMARY KEY(student_id, subject_name)
);

-- Using a trigger, enforce that if a student ever receives a D or
-- T for a subject, the student cannot take the same subject
-- again. (Otherwise students may repeat a subject.)
CREATE FUNCTION TF_DTGrades() RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT * FROM Grade WHERE ((Grade.grade = 'D' OR Grade.grade = 'T') AND (Grade.student_id = NEW.student_id) AND
  (Grade.subject_name = NEW.subject_name) AND (Grade.year <= NEW.year))) THEN
    RAISE EXCEPTION 'student % cannot retake %', NEW.student_id, NEW.subject_name;
  END IF;
  IF EXISTS (SELECT * FROM Grade WHERE ((Grade.grade = 'D' OR Grade.grade = 'T') AND (Grade.student_id = NEW.student_id) AND
  (Grade.subject_name = NEW.subject_name) AND (Grade.year > NEW.year))) THEN 
    RAISE EXCEPTION 'student % has already failed %', NEW.student_id, NEW.subject_name;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER TG_DTGrades
  BEFORE INSERT OR UPDATE ON Grade
  FOR EACH ROW
  EXECUTE PROCEDURE TF_DTGrades();

-- Using triggers, enforce that a person cannot be both student
-- and teacher at the same time.
CREATE FUNCTION TF_NoStudent() RETURNS TRIGGER AS $$
BEGIN 
  IF EXISTS (SELECT * FROM Student WHERE Student.id = NEW.id) THEN
    RAISE EXCEPTION 'potential teacher is already a student with id %', NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER TG_NoStudent
  BEFORE INSERT OR UPDATE ON Teacher
  FOR EACH ROW
  EXECUTE PROCEDURE TF_NoStudent();

  -- Using triggers, enforce that a person cannot be both student
-- and teacher at the same time.
CREATE FUNCTION TF_NoTeacher() RETURNS TRIGGER AS $$
BEGIN 
  IF EXISTS (SELECT * FROM Teacher WHERE Teacher.id = NEW.id) THEN
   RAISE EXCEPTION 'potential student is already a teacher with id %', NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER TG_NoTeacher
  BEFORE INSERT OR UPDATE ON Student
  FOR EACH ROW
  EXECUTE PROCEDURE TF_NoTeacher();

-- Define a view that lists, for each House, the total number of
-- points accumulated by the House during the school year 1991-1992
-- (which started on September 1, 1991 and ended on June 30,
-- 1992). Note that your view should list all Houses, even if a House
-- didn’t have any points earned or deducted during this period (in
-- which case the total should be 0) or there were more points
-- deducted than earned (in which case the total should be negative).
CREATE VIEW HousePoints(house, points) AS
SELECT Student.house_name, COALESCE(SUM(F.points),0)
FROM Student LEFT JOIN (SELECT * FROM Deed
WHERE (Deed.datetime BETWEEN '1991-09-01 00:00:00' AND  '1992-07-01 00:00:00')) 
AS F
ON Student.id = F.student_id
GROUP BY Student.house_name
ORDER BY 2 DESC, 1 ASC;

