// node app.js

const express = require("express");
const app = express();

app.use(express.static(__dirname+"/web"));

app.get("/", function (req, res) {
    res.sendFile("index.html");
});

app.listen(3000, function () {
    console.log("Server is running on localhost:3000");
});