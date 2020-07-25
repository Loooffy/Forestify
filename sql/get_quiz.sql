SELECT 
    quiz.*,
    JSON_OBJECTAGG(ifnull(images.image_number, 0), ifnull(images.image, '')) AS images,
    JSON_ARRAYAGG(choices.choice_content) AS choices
FROM
    quiz
        left JOIN
    images ON quiz.qid = images.qid
        INNER JOIN
    choices ON quiz.qid = choices.qid
WHERE
    quiz.id = 194
GROUP BY quiz.id