const User = require('../model/user_model');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const pug = require('pug');
require('dotenv').config();
const {JWT_SECRET} = process.env;
const jwtSignOptions = {
  algorithm: 'HS256',
  // expiresIn: 3600,
  // ignoreExpiration: true,
};

async function generateToken(email, name) {
  const payload = {
    provider: 'native',
    email: email,
    name: name,
  };

  const jwtToken = await jwt.sign(payload, JWT_SECRET, jwtSignOptions);
  return jwtToken;
}

function sendCookie(res, jwtToken, name, email) {
  res.cookie('token', jwtToken, {encode: String})
      .cookie('name', name, {encode: String})
      .cookie('email', email, {encode: String})
      .redirect('/quiz?qid=26197');
}

async function signUp(req, res) {
  console.log(req.user_id)
  const {name, email, password} = req.body;
  if (!email || !password || !name) {
    res.status(200).send({invalid: 'inputNotComplete'});
    return;
  }

  const student = await User.signUp(email, name, password);
  if (student.err) {
    if (student.err === 'ER_DUP_ENTRY') {
      res.status(200).send({invalid: 'duplicateEmail'});
      return;
    }
  }
  console.log(name, email);
  const jwtToken = await generateToken(email, name);
  sendCookie(res, jwtToken, name, email);
}

async function signIn(req, res) {
  const {name, email, password, provider, token} = req.body;

  if ((!email || !password) && (!provider || !token)) {
    res.status(200).send({invalid: 'inputNotComplete'});
    return;
  } else if (email && password) {
    const student = await User.nativeSignIn(email, password);
    if (!student) {
      res.status(200).send({invalid: 'authFailed'});
      return;
    }

    const jwtToken = await generateToken(student.email, student.name);
    console.log(jwtToken, name, email);
    sendCookie(res, jwtToken, email, name);

    return;
  } else if (provider && token) {
    const {exp, id} = req.body;
    getFbDataUrl = `https://graph.facebook.com/${id}?fields=name,email&access_token=${token}`;
    const fbData = await fetch(getFbDataUrl).then((r) => r.json());
    const student = User.facebookSignIn(fbData.email);
    student.provider = provider;
    const data= {
      'access_token': token,
      'access_expired': exp,
    };
    resData = {data, student};
    res.send(JSON.stringify(resData));
  }
}

async function renderSignBlock() {
  try {
    const renderer = await pug.compileFile('static/sign.pug');
    const signBlock = renderer();
    return signBlock;
  } catch (err) {
    console.log(err);
    return;
  }
}

async function isLogged(req, res, next) {
  let noNeedLog = [
    'getQuizData', 
    'getQid', 
  ]
  try {
    let token = req.headers.authorization.split(' ')[1]
    if (!token || token === 'null') {
      noNeedLog.some(async (url) => {
          if (req.originalUrl.includes(url)) {
              next()
              return true
          } else {
            console.log(req.originalUrl)
            const signBlock = await renderSignBlock();
            res.status(200).send({signBlock: signBlock});
            return;
          }
      })
      return 
    }
    const jwtToken = await jwt.verify(token, JWT_SECRET, jwtSignOptions);
    const {provider, email} = jwtToken;
    const valid = await User.isLogged(email);
    if (!valid) {
      const signBlock = await renderSignBlock();
      res.status(401).json({signBlock: signBlock});
      return;
    }
    const user_id = await User.getUser(email);
    req.user_id = user_id.id;
    console.log(req.user_id, 'loggin')
    next();
  } catch (err) {
        console.log('err msg', err.message);
        let signBlock = await renderSignBlock();
        if (err.message.includes('jwt expired')) {
          const jwtToken = generateToken(name, email);
          sendCookie();
        } else if (err.message.includes('invalid signature')){
          res.status(200).json({signBlock: signBlock})
        } else if (err.message.includes('jwt malformed')){
          res.status(200).json({signBlock: signBlock})
        } else if (err.message.includes('jwt must be provided')){
          res.status(200).json({signBlock: signBlock})
        } else {
          res.status(500).send('server error')
        }
        return;
    }
}

async function getStatus(req, res) {
  const user_id = req.user_id;
  const status = await User.getStatus(user_id);
  res.status(200).json(status);
}

async function getTreePoint(req, res) {
  const user_id = req.user_id;
  const treePoint = await User.getTreePoint(user_id);
  res.status(200).json(treePoint);
}

async function getMyQA(req, res) {
  const user_id = req.user_id;
  const myQA = await User.getMyQA(user_id);
  res.status(200).json(myQA);
}


module.exports = {
  signUp,
  signIn,
  isLogged,
  getStatus,
  getTreePoint,
  getMyQA,
};
