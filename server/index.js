import express from 'express';
import mysql from 'mysql';

const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
});

app.listen('8000', connection.connect(function(err) {
    if(err){
        console.log(err)
    } else {
        console.log("Server running on port 8000 and connected to MySQL")
    }
}));