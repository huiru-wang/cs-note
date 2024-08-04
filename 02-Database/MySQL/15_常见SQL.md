组内排序 ➡️ 窗口函数

找某个字段重复记录 ➡️ 按字段分组后`COUNT(*) > 1`

## 总分最高

学生表：t_student(id, name)

课程表：t_course(id, course)

成绩表：t_score(id, course_id, student_id, score)

```sql
-- 按成绩总分排序，可能最高分不止一个学生
WITH temp AS (
    SELECT student_id, SUM(score) AS total_score
    FROM t_score
    GROUP BY student_id
)

-- 取出最高分的学生id
SELECT t.student_id, s.`name`
FROM temp t
LEFT JOIN t_student s ON t.student_id = s.id
WHERE t.total_score = (SELECT MAX(total_score) FROM temp);
-------------------------------------------------------
student_id  name
    1	    Lily
    4	    Amily
```