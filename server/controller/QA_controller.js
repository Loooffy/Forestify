const QA = require('../model/QA_model');

const getQAData = async (req, res) => {
  const qid = req.query.qid;
  const result = await QA.getQAData(qid);
  res.json(result);
};

const postQ = async (req, res) => {
  const data = {
    qid: req.body.qid,
    post_time: req.body.post_time,
    title: req.body.title,
    content: req.body.content,
    head_id: req.body.head_id,
  };
  data.user_id = req.user_id;
  const result = await QA.postQ(data);
  res.send(JSON.stringify(result.insertId));
};

module.exports = {
  getQAData,
  postQ,
};
