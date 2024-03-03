const http = require('http')
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const cors = require('cors')
const users = require('./users')
const upload = multer({ dest: 'public/' })

const app = express()

app.use(morgan('combined'))

app.get('/', (req, res) => {
    res.send("This is the home page")
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))

// Endpoint untuk memberikan list data users
app.get('/users', (req, res) => {
    res.json(users)
})

app.get('/users/:name', (req, res) => {
    const user = users.find(user => user.name.toLowerCase() === req.params.name.toLowerCase())
    if (user) {
        res.json(user)
    } else {
        res.status(404).json({
            message: 'Data user tidak ditemukan'
        })
    }
})

app.post('/users', (req, res) => {
    const { name } = req.body
    if (!name) {
        res.status(400).json({
            message: 'Nama user tidak boleh kosong'
        })
    } else {
        const id = users.length + 1
        const newUser = { id, name }
        users.push(newUser)
        res.json({ message: 'Data berhasil ditambahkan', user: newUser })
    }
})

app.post ('/upload', upload.single('file'), (req, res) => {
    const file = req.file
    if(file){
        const target = path.join (__dirname, 'public', file.originalname)
        fs.renameSync (file.path, target)
        res.send ("file sudah diupload")
    }
    else{
        res.send("file tidak terupload")
    }
});

app.put('/users/:name', (req, res) => {
    const { name } = req.params
    const { newName } = req.body
    const userIndex = users.findIndex(user => user.name.toLowerCase() === name.toLowerCase())
    if (userIndex !== -1 && newName) {
        users[userIndex].name = newName
        res.json({ message: 'Data berhasil diupdate', user: users[userIndex] })
    } else if (userIndex === -1) {
        res.status(404).json({ message: 'Data user tidak ditemukan' })
    } else {
        res.status(400).json({ message: 'Nama baru user tidak boleh kosong' })
    }
})

app.delete('/users/:name', (req, res) => {
    const { name } = req.params
    const userIndex = users.findIndex(user => user.name.toLowerCase() === name.toLowerCase())
    if (userIndex !== -1) {
    const deletedUser = users.splice(userIndex, 1)
        res.json({ message: 'Data berhasil dihapus', user: deletedUser })
    } else {
        res.status(404).json({ message: 'Data user tidak ditemukan' })
    }
})

app.use((req, res, next) => {
    res.status(404).json({
        status: 'Error',
        message: 'Resource tidak ditemukan'
    })
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        status: 'Error',
        message: 'Terjadi kesalahan pada server'
    })
})

const corsOptions = {
    origin: 'http://127.0.0.1:5500',
}
    
app.use(cors(corsOptions))

const hostname = '127.0.0.1'
const port = 3000
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
