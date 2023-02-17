const express = require('express');
const app = express();
var cors = require('cors');
app.use(express.json());
app.use(cors());

require('dotenv').config();

require('./db/connection');
 
// const dotenv = require('dotenv')
// dotenv.config({path:'./.env'});


//we link the router files
app.use(require('./router/auth'));



const server = app.listen(5000,()=>{
    console.log('Server Started');
});