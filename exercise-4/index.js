const http = require('http')
const express = require('express')
const userS = require('./users')
const app = express()
const morgan = require('morgan')

app.use(morgan('combined'))

app.get('/', (req, res) => {
    res.send("This is the home page")
})

app.get('/users', (req, res) => {
    res.json(userS)
})

app.get('/users/:name', (req, res) => {
    const user = userS.find(user => user.name.toLowerCase() === req.params.name.toLowerCase())
    if (user) {
        res.json(user)
    } else {
        res.status(404).json({
            message: "Data user tidak ditemukan"
        })
    }
})

app.use((req, res) => {
    res.status(404).json({
        status: "Error",
        message: "Resource tidak    ditemukan",
    })
})

const errorHandling = (err, req, res, next) => {
    res.status(500).json({
        status: "Error",
        message: "terjadi kesalahan pada server",
    })
}
app.use(errorHandling)

const hostname = '127.0.0.1'
const port = 3000
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})
