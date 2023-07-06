const express = require('express');
const router=express.Router()
const mysql=require('mysql')
const con=require('../utils/Connection.js')

router.route('/create').post((req,res)=>{
    const body=req.body
    console.log(body)
    res.status(200).send("ok")
})

module.exports=router