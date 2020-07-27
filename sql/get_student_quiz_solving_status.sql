SELECT 
    qsc.code,
    qsc.user_id,
    qsc.time,
    qsc.correct,
    code_quiz.quiz_title,
    code_topic.topic AS lv1_topic,
    lv2.topic AS lv3_topic,
    lv3.topic AS lv3_topic
FROM
    code_topic
        INNER JOIN
    (SELECT 
        qs.qid, qs.user_id, qs.time, qs.correct, quiz.code
    FROM
        quiz_solving AS qs
    INNER JOIN quiz ON qs.qid = quiz.qid
    WHERE
        user_id = 33) AS qsc ON LEFT(qsc.code, 3) = code_topic.code
        INNER JOIN
    code_topic AS lv2 ON LEFT(qsc.code, 5) = lv2.code
        INNER JOIN
    code_topic AS lv3 ON LEFT(qsc.code, 7) = lv3.code
    inner join code_quiz on code_quiz.code = qsc.code
ORDER BY time DESC
LIMIT 5