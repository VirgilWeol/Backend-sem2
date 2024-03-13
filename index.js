const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const db = require('./db.js')

app.use(morgan('combined'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.send("This is the home page")
})

app.get('/students', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM public.students');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
});

app.post("/students", async (req, res) => {
    const { name, address } = req.body
    try {
        if(!name || !address){
            res.status(400).json({
                status: "error",
                message: "name dan address harus diisi"
            })
        }else if(name.length > 2 || address.length > 2){
            const result = await db.query(
                `INSERT into students (name, address) values ('${name}', '${address}')`
            )
            res.status(200).json({
                status: "success",
                message: "data berhasil dimasukan"
            })
        }
    }catch(err){
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
})

app.put("/students/:id", async (req, res) => {
    const { name, address } = req.body
    try{
        if(!name || !address){
            res.status(400).json({
                status: "error",
                message: "name dan address harus diisi"
            })
        }else if(name.length > 2 || address.length > 2){
            const result = await db.query(
                `UPDATE students SET name = '${name}', address = '${address}' WHERE id = ${req.params.id}`
            )
            res.status(200).json({
                status: "success",
                message: `data dengan id ${req.params.id} berhasil diubah`
            })
        }
    }catch(err){
        console.log(err)
        res.status(500).send("Internal Server Error")
    }
})

// Exe7. Delete Student by ID
app.delete("/students/:id", async (req, res) => {
    try{
        const result = await db.query(
            `DELETE FROM students WHERE id = ${req.params.id}`
        )
        res.status(200).json({
            status: "success",
            message: `data dengan id ${req.params.id} berhasil dihapus`
        })
    }catch(err){
        console.log(err)
        res.status(500).send("Internal Server Error")
    }
})

// Exe7. Get student by ID
app.get("/students/:id", async (req, res) => {
    try{
        const result = await db.query(
            `SELECT * FROM students WHERE id = ${req.params.id}`
        )
        if(result.rows.length > 0){
            res.status(200).json({
                data: result.rows
            })
        }else if(result.rows.length == 0){
            res.status(404).json({
                message: `data dengan id ${req.params.id} tidak ditemukan`
            })
        }
    }catch(err){
        console.log(err)
        res.status(500).send("Internal Server Error")
    }
})

app.use(cors(
    {
        origin: 'http://127.0.0.1:5500',
        credentials: true
    }
))

const hostname = '127.0.0.1'
const port = 3000
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})
