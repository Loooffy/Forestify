SELECT QA.*, student.id as owner_id, student.name as owner_name, v.total_vote
from QA
inner join quiz on quiz.id = QA.quiz_id
inner join student as student on QA.owner_id = student.id
inner join (select QA_id, sum(vote) as total_vote from votes group by QA_id) as v on QA.id = v.QA_id
where quiz.id = 1
order by QA.post_time DESC