select t.*, code_topic.topic from code_topic inner join
(SELECT 
    quiz.qid, code_quiz.lv3_topic_code, code_quiz.quiz_title
FROM
    code_quiz
        INNER JOIN
    quiz ON quiz.code = code_quiz.code
		left join 
	code_topic on quiz.code = code_topic.code
WHERE
    quiz.code LIKE '%mjsxs9a%') as t
on code_topic.code like concat('%', t.lv3_topic_code, '%')