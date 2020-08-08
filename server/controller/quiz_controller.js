const Quiz = require('../model/quiz_model');
const marked = require('marked');

const getQuizData = async (req, res) => {
  let {qid} = req.query;
  qid = req.query.qid ? req.query.qid : 41882;
  req.user_id = req.user_id ? req.user_id : 0
  const result = await Quiz.getQuizData(qid, req.user_id);
  result[0].question = marked(result[0].question_content);
  res.json(result[0]);
};

const getSameTopicQuiz = async (req, res) => {
  let {qid} = req.query;
  qid = req.query.qid ? req.query.qid : 41882;
  const result = await Quiz.getSameTopicQuiz(qid);
  res.send(JSON.stringify(result));
};

const getQid = async (req, res) => {
  const {code} = req.query;
  const {qid} = await Quiz.getQid(code);
  res.send(JSON.stringify(qid));
};

const postAnswer = async (req, res) => {
  try {
    const {qid, correct} = req.body;
    const result = await Quiz.postAnswer(qid, req.user_id, correct);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('server error');
  }
};

module.exports = {
  getQuizData,
  getSameTopicQuiz,
  getQid,
  postAnswer,
};
