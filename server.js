const fs = require("fs");
const db = "./visitors.json";
const express = require("express");
const app = express();

let users = {
    visitors: [],
};

if (fs.existsSync(db)) {
    users = JSON.parse(fs.readFileSync(db, "utf-8"));
}

app.use((request, response, next) => {
    if (request.url === "/favicon.ico") {
        return response.end();
    }
    
    if (request.headers["iknowyoursecret"] !== "TheOwlsAreNotWhatTheySeem") {
        return response.end("You don't know the secret");
    }
    
    next();
});

app.post("/", (request, response, next) => {
    const name = request.query.name;

    if (!name) {
        return response.end("Name not detected");
    }

    const ip = request.ip;

    const visitor = { name, ip };
    users.visitors.push(visitor);

    fs.writeFile(db, JSON.stringify(users), err => {
        if (err) {
            throw err;
        }
    })

    response.send(`Hello, ${users.visitors.map(visitor => visitor.name).join(", ")}!`);
    return response.end();
});

app.listen(8080, console.log("Server listening at port 8080"));