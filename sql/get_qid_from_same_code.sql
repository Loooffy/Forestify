select 
	code_title.title, q.qid
from 
	code_title
inner JOIN (
	SELECT
		quiz.code,
		JSON_ARRAYAGG(quiz.qid) as qid
	FROM
		quiz
	where 
		quiz.code like '%fs7%'
	group by 
		quiz.code
) as q
on q.code = code_title.code