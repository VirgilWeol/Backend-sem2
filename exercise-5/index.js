const express = require ("express")
const app = express()
const morgan = require ("morgan")
const path = require ("path")
const multer = require ("multer")
const fs = require ("fs")
const upload = multer ({ dest: "public/"})
const cors = require ("cors")

app.use (morgan("combined"))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use (express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    res.send(`Anda login dengan username ${username} dan password ${password}`);
  });

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

app.use(cors())

app.get("/api/data", (req, res) => {
    res.json({ message: "Ini adalah contoh data dari Rest API" })
});

const hostname = '127.0.0.1'
const port = 3000
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})