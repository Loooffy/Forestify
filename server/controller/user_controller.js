const User = require('../model/user_model')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const pug = require('pug')
const jwtSignOptions = {
    algorithm: 'HS256',
    //expiresIn: 3600,
    //ignoreExpiration: true,
};
const secret = 'han'

async function generateToken (email, name) {
    const payload = {
        provider:'native',
        email:email,
        name:name,
    }

    const jwtToken = await jwt.sign(payload, secret, jwtSignOptions)
    return jwtToken
}

function sendCookie (res, jwtToken, name, email) {
    res.cookie('token', jwtToken, {encode: String})
        .cookie('name', name, {encode: String})
        .cookie('email', email, {encode: String})
        .redirect('/quiz?qid=26197')
}
    
async function signUp(req, res){
    let { name, email, password } = req.body
    if (!email || !password || !name){
        res.status(200).send({invalid: 'inputNotComplete'})
        return
    } 
    
    let student = await User.signUp(email, name, password)
    if (student.err){
        if (student.err === 'ER_DUP_ENTRY') {
            res.status(200).send({invalid: 'duplicateEmail'})
            return
        }
    }
    console.log(name, email)
    let jwtToken = await generateToken(email, name)
    sendCookie(res, jwtToken, name, email)
}

async function signIn(req, res){
    let { name, email, password, provider, token } = req.body

    if ((!email || !password) && (!provider || !token)){
        res.status(200).send({invalid: 'inputNotComplete'})
        return
    } else if (email && password) { 

        let student = await User.nativeSignIn(email, password)
        if (!student){
            res.status(200).send({invalid: 'authFailed'})
            return
        }

        let jwtToken = await generateToken(student.email, student.name)
        console.log(jwtToken, name, email)
        sendCookie(res, jwtToken, email, name)

        return

    } else if (provider && token){
        let { exp, id } = req.body
        getFbDataUrl = `https://graph.facebook.com/${id}?fields=name,email&access_token=${token}`
        let fbData = await fetch(getFbDataUrl).then(r => r.json())
        let student = User.facebookSignIn(fbData.email)
        student.provider = provider
        let data= {
            "access_token": token,
            "access_expired": exp
        }
        resData = {data, student}
        res.send(JSON.stringify(resData))
    }
}

async function renderSignBlock (){
    try {
        let renderer = await pug.compileFile('static/sign.pug')
        let signBlock = renderer()
        return signBlock
    } catch (err) {
        console.log(err)
        return 
    }
}

async function isLogged (req, res, next){
    try {
        let token = [req.body.token, req.query.token].filter(r => r != undefined)[0]
        if (!token){
            let signBlock = await renderSignBlock()
            res.status(200).send({signBlock: signBlock})
            return
        }
        let jwtToken = await jwt.verify(token, secret, jwtSignOptions)
        //let jwtToken = await jwt.verify(token, secret, jwtSignOptions)
        let { provider, email } = jwtToken
        let valid = await User.isLogged(email)
        if (!valid){
            let signBlock = await renderSignBlock()
            res.status(401).json({signBlock: signBlock})
            return
        }
        let user_id = await User.getUser(email)
        req.user_id = user_id.id
        console.log('log', req.user_id)
        next()
    } catch(err) {
        if (err.message === 'jwt expired') {
            let jwtToken = generateToken(name, email)
            sendCookie()
        } else {
            console.log(err)
            res.status(500).send('server error')
        }
            
        return
    }
}

async function getStatus (req, res) {
    let user_id = req.user_id
    let status = await User.getStatus(user_id)
    res.status(200).json(status)
}    

async function getTreePoint (req, res) {
    let user_id = req.user_id
    let treePoint = await User.getTreePoint(user_id)
    res.status(200).json(treePoint)
}    

async function getMyQA (req, res) {
    let user_id = req.user_id
    let myQA = await User.getMyQA(user_id)
    res.status(200).json(myQA)
}    
    
    
module.exports = {
    signUp,
    signIn,
    isLogged,
    getStatus,
    getTreePoint,
    getMyQA,
}
