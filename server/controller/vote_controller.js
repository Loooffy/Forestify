const Vote = require('../model/vote_model');

const giveVote = async (req, res) => {
  const data = {
    giver_id: req.user_id,
    QA_id: req.body.QA_id,
    qid: req.body.qid,
  };
  const result = await Vote.giveVote(data);
  console.log('givevote', result);
  res.json(result);
};

const removeVote = async (req, res) => {
  const QA_id = req.body.QA_id;
  const giver_id = req.user_id;
  const result = await Vote.removeVote(giver_id, QA_id);
  res.json(result);
};

const getVote = async (req, res) => {
  const QA_id = req.query.QA_id;
  const giver_id = req.user_id;
  const result = await Vote.getVote(giver_id, QA_id);
  console.log('getvote', result);
  res.json(result);
};

const voteBack = async (req, res) => {
  const QA_id = req.body.QA_id;
  const giver_id = req.user_id;
  const result = await Vote.voteBack(giver_id, QA_id);
  res.json(result);
};

module.exports = {
  giveVote,
  removeVote,
  getVote,
  voteBack,
};
