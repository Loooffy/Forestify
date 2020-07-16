const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.json())

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

app.listen(port, () => console.log('app listening'))
