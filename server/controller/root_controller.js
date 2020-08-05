const marked = require('marked');
const Quiz = require('../model/quiz_model');
const QA = require('../model/QA_model');
const hexMap = require('../../util/hexMapCreator');
require('dotenv').config();
const {HEX_MAP_X0, HEX_MAP_Y0, HEX_GRID_SIZE, OUTER_HEX_RATIO, INNER_HEX_RATIO} = process.env;
const {INDEX_PAGE_QID} = process.env;

const renderQuizPage = async (req, res) => {
  let qid = req.query.qid;
  qid = req.query.qid ? req.query.qid : INDEX_PAGE_QID;
  const result = await QA.getQAData(qid);
  const allHex = hexMap.createHexMap(parseInt(HEX_MAP_X0), parseInt(HEX_MAP_Y0), parseInt(HEX_GRID_SIZE), parseInt(OUTER_HEX_RATIO), parseInt(INNER_HEX_RATIO));
  const renderData = {
    qid: qid,
    hexData: allHex,
  };
  res.render('index', renderData);
};

module.exports = {
  renderQuizPage,
};
