const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).send(JSON.stringify({'message': 'server running'}));
})

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
})

app.listen(8000, function(){
    connection.connect(function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Server running and MySQL connected");
        }
    })
})