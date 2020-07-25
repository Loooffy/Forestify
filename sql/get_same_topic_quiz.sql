select 
	code_title.code, code_title.title
from
	code_title
where
	code_title.code
like concat('%', (
		select 
			left(quiz.code, 7)
		from 
			quiz
		where 
			qid = 34604
	), '%'
)
	