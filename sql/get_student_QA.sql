SELECT 
    allQA.content,
    allQA.owner_name,
    allQA.total_vote,
    allQA.title,
    lv1.topic,
    lv2.topic,
    lv3.topic
FROM
    (SELECT 
        QA.*,
            student.name AS owner_name,
            v.total_vote as total_vote,
            quiz.code,
            cq.lv1_topic_code,
            cq.lv2_topic_code,
            cq.lv3_topic_code
    FROM
        QA
    INNER JOIN quiz ON quiz.qid = QA.qid
    INNER JOIN student AS student ON QA.user_id = student.id
    INNER JOIN (SELECT 
        QA_id, SUM(vote) AS total_vote
    FROM
        votes
    GROUP BY QA_id) AS v ON QA.id = v.QA_id
    INNER JOIN code_quiz AS cq ON cq.code = quiz.code) AS allQA
        INNER JOIN
    code_topic AS lv1 ON LEFT(allQA.code, 3) = lv1.code
        INNER JOIN
    code_topic AS lv2 ON LEFT(allQA.code, 5) = lv2.code
        INNER JOIN
    code_topic AS lv3 ON LEFT(allQA.code, 7) = lv3.code
WHERE
    user_id = 41
ORDER BY allQA.post_time DESC