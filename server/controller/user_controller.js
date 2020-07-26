const User = require('../model/user_model')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const pug = require('pug')
const jwtSignOptions = {
    algorithm: 'HS256',
    expiresIn: 3600,
    ignoreExpiration: true,
};
const secret = 'han'

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

    const payload = {
        provider:'native',
        name:name,
        email:email,
    }

    const jwtToken = await jwt.sign(payload, secret, jwtSignOptions)
    
    res.cookie('token', jwtToken, {encode: String})
        .cookie('name', name, {encode: String})
        .cookie('email', email, {encode: String})
        .redirect('/quiz?quiz_id=1')
}

async function signIn(req, res){
    let { name, email, password, provider, token } = req.body

    if ((!email || !password) && (!provider || !token)){
        res.status(200).send({invalid: 'inputNotComplete'})
        return
    } else if (email && password) { 

        let valid = await User.nativeSignIn(email, password)
        if (!valid){
            res.status(200).send({invalid: 'authFailed'})
            return
        }
        const payload = {
            provider:'native',
            name:name,
            email:email,
        }

        const jwtToken = await jwt.sign(payload, secret, jwtSignOptions)
        res.cookie('token', jwtToken, {encode: String})
            .cookie('name', name, {encode: String})
            .cookie('email', email, {encode: String})
            .redirect('/quiz?quiz_id=1')
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
        let {token} = req.body
        if (!token){
            let signBlock = await renderSignBlock()
            res.status(200).send({signBlock: signBlock})
            return
        }
        let jwtToken = await jwt.verify(token, secret, jwtSignOptions)
        let { provider, email } = jwtToken
        let valid = await User.isLogged(email)
        if (!valid){
            let signBlock = await renderSignBlock()
            res.status(401).send({signBlock: signBlock})
            return
        }
        let user_id = await User.getUser(email)
        req.user_id = user_id.id
        //student.provider= provider
        //resData = {data: student}
        //res.send(JSON.stringify(resData))
        next()
    } catch(err) {
        console.log(err)
        res.status(500).send('server error')
        return
    }
}
    
    
module.exports = {
    signUp,
    signIn,
    isLogged
}
