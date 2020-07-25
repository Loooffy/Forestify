SELECT 
    quiz.*, code_quiz.*, code_topic.topic
FROM
    quiz
        INNER JOIN
    code_quiz ON quiz.code = code_quiz.code
		INNER JOIN
code_topic ON code_quiz.lv3_topic_code = code_topic.code
WHERE
    qid = 54783