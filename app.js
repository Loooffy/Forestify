const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const secret = 'han'

const { query, transaction, commit, rollback } = require('./util/mysqlCon.js');
const jwt = require('jsonwebtoken')
const jwtSignOptions = {
    algorithm: 'HS256',
    expiresIn: 3600
};


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use('/' ,
    [
        require('./server/route/root_route')
    ]
)

app.use('/api/' ,
    [
        require('./server/route/quiz_route'),
        require('./server/route/QA_route'),
        require('./server/route/vote_route'),
    ]
);

app.set('view engine', 'pug')
app.set('views', './static')
app.use('/static', express.static('./static'))

app.post('/user/signup', (req, res) => signUp(req, res))
app.post('/user/signin', (req, res) => signIn(req, res))


async function signUp(req, res){
    if (req.body.email === undefined || req.body.password === undefined){
       console.log(req)
       res.status(400).send('invalid input')
    } else {
        try {
        let name = req.body.name
        let email = req.body.email
        let password = req.body.password
        const payload = {
            provider:'native',
            name:name,
            email:email,
        }
        await query(`insert into student(email, name, password) values('${email}', '${name}', '${password}')`)
        const jwtToken = await jwt.sign(payload, secret, jwtSignOptions)
        let userQ = await query(`select id, email, name from student where email = '${email}'`)
        
        let data= {
            "access_token": jwtToken,
            "access_expired": 3600,
        }
        let student = userQ[0]
        console.log(student)
        res.cookie('token', jwtToken, {encode: String})
            .cookie('name', student.name, {encode: String})
            .cookie('email', student.email, {encode: String})
            .redirect('../quiz?quiz_id=1')

        } catch (err) {
            console.log(err)
            if (err instanceof TypeError){
                res.status(500).send(err)
            } else if (err!= undefined) {
                let emailExisted = err.code === 'ER_DUP_ENTRY'
                if (emailExisted === true){
                    res.status(403).send('this email had been signed up, please try another one')
                } else {
                    res.status(500).send(err)
                }
            } else {
                console.log(err)
                res.status(500).send(err)
            }
        }
    }
}

async function signIn(req, res){
    let validInput = req.body.email && req.body.password
    let facebookLogin = req.body.provider && req.body.token
    if (!validInput && !facebookLogin){
       res.status(400).send('invalid input')
    } else if (validInput){
        let name = req.body.name
        let email = req.body.email
        let password = req.body.password
        let provider = req.body.provider
        let valid = await query(`select exists(select id from student where email='${email}' and password='${password}')`).then(v => parseInt(Object.values(v[0][0])))
        if (!valid){
            res.status(403).send('invalid email or password')
        } else {
            const payload = {
                provider:'native',
                name:name,
                email:email,
            }
            let userQ = await query(`select id, name, email, from student where email = '${email}'`)
            const jwtToken = await jwt.sign(payload, secret, jwtSignOptions)
            let data= {
                "access_token": jwtToken,
                "access_expired": 3600,
            }
            let user = userQ[0][0]
            user.provider = provider
            res.cookie('token', jwtToken, {encode: String})
                .cookie('name', student.name, {encode: String})
                .cookie('email', student.email, {encode: String})
                .redirect('../quiz?quiz_id=1')
        }
    } else if (facebookLogin){
        let provider = req.body.provider
        let token = req.body.token
        let exp = req.body.exp
        let id = req.body.id
        getFbDataUrl = `https://graph.facebook.com/${id}?fields=name,email&access_token=${token}`
        let fbData = await fetch(getFbDataUrl).then(r => r.json())
        console.log(fbData)
        let user = await query(`select id, name, email from student where email = '${fbData.email}'`)
        user = user[0][0]
        user.provider = provider
        let data= {
            "access_token": token,
            "access_expired": exp
        }
        resData = {data, user}
        res.send(JSON.stringify(resData))
    }
}

app.listen(port, () => console.log('app listening'))
