const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

app.use(morgan('combined'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("This is the home page");
});

app.get('/students', async (req, res) => {
    try {
        const allStudents = await prisma.students.findMany();
        res.json(allStudents);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post("/students", async (req, res) => {
    const { name, address } = req.body;
    try {
        if (!name || !address) {
            res.status(400).json({
                status: "error",
                message: "name dan address harus diisi"
            });
        } else {
            const newStudent = await prisma.students.create({
                data: {
                    name: name,
                    address: address
                }
            });
            res.status(200).json({
                status: "success",
                message: "data berhasil dimasukan"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.put("/students/:id", async (req, res) => {
    const { name, address } = req.body;
    const idStudent = parseInt(req.params.id);
    try {
        if (!name || !address) {
            res.status(400).json({
                status: "error",
                message: "name dan address harus diisi"
            });
        } else {
            const updatedStudent = await prisma.students.update({
                where: {
                    id: idStudent
                },
                data: {
                    name: name,
                    address: address
                }
            });
            res.status(200).json({
                status: "success",
                message: `data dengan id ${idStudent} berhasil diubah`
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.delete("/students/:id", async (req, res) => {
    const idStudent = parseInt(req.params.id);
    try {
        const deletedStudent = await prisma.students.delete({
            where: {
                id: idStudent
            }
        });
        res.status(200).json({
            status: "success",
            message: `data dengan id ${idStudent} berhasil dihapus`
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/students/:id", async (req, res) => {
    const idStudent = parseInt(req.params.id);
    try {
        const student = await prisma.students.findUnique({
            where: {
                id: idStudent
            }
        });
        if (student) {
            res.status(200).json({
                data: student
            });
        } else {
            res.status(404).json({
                message: `data dengan id ${idStudent} tidak ditemukan`
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}));

const hostname = '127.0.0.1';
const port = 3000;
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
