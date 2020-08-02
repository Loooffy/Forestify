const express = require('express')
const bodyParser = require('body-parser')
const app = express()
require('dotenv').config();
const {PORT} = process.env;
const port = PORT

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
        require('./server/route/user_route'),
        require('./server/route/topic_route'),
        require('./server/route/map_route'),
    ]
);

app.set('view engine', 'pug')
app.set('views', './static')
app.use('/static', express.static('./static'))

app.use(function(req, res, next) {
    res.status(404).send('page not found')
});

app.use(function(err, req, res, next) {
    console.log(err);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => console.log('app listening'))
