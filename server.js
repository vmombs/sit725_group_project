const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.port || 3000;

app.listen(port,()=>{
  console.log("App listening to: "+port)
});
