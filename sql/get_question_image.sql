SELECT 
	quiz.*,
	JSON_OBJECTAGG(IFNULL(images.image_number, 0),
			IFNULL(images.image, '')) AS images,
	JSON_ARRAYAGG(choices.choice_content) AS choices
FROM
	quiz
		LEFT JOIN
	images ON quiz.qid = images.qid
		INNER JOIN
	choices ON quiz.qid = choices.qid
WHERE
	quiz.qid = 51590
GROUP BY quiz.id 