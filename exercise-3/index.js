const http    = require('http');
const members = require('./members.js')
const userS   = require('./users.js')
const moment  = require('moment')
const morgan  = require('morgan')
const express = require('express');
const app = express();


app.use(morgan('combined'));

app.get('/', (req, res) => (res.send('This is the Home Page')))

app.get('/about', (req, res) => {res.send(JSON.stringify({
        'status': 'success',
        'message': 'response success',
        'description': 'Exercise #03',
        date: moment().format(),
        data: JSON.stringify(members)
        })
    )
});

app.get('/users', async (req, res) => {
    const dataUsers = await userS();
    res.send(JSON.stringify(dataUsers));
});

const hostname = '127.0.0.1';
const port = 3000;
app.listen(port, hostname, () =>{
    console.log('Server running at http://${hostname}:${port}/');
})