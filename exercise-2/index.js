const http    = require("http");
const members = require("./members.js");
const users   = require("./users.js");
const moment  = require("moment");

const server = http.createServer((req, res) =>{
    const url = req.url;
    res.statusCode = 200;

    if (url === "/"){
        res.setHeader('Content-Type', 'text/plain');
        res.write("This Is the Home Page");
    }
    else if (url === "/about"){
        res.setHeader('Content-Type', 'text/plain');
        res.write(
            JSON.stringify({
                status: "success",
                message: "response success",
                description: "Exercise #03",
                date:moment().format(),
                data: members,
            })
        )
    }
    else if (url === "/users"){
        res.setHeader("Content-type", "text/json");
        res.write(JSON.stringify(users));
    }
    res.end();
})

const hostname = '127.0.0.1'; // atau localhost
const port = 3000;
server.listen(port, hostname, () => {
    console.log('Server running at http://${hostname}:${port}/');
});