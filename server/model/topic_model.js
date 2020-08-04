const {query, transaction, commit, rollback} = require('../../util/mysqlCon.js');

async function getTopic() {
  const result = await query('select * from code_topic');
  return result;
}

module.exports = {
  getTopic,
};
