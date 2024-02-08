const express = require('express');
const app = express();
var cors = require('cors');
// app.use(express.json());
app.use(cors());
var bodyParser = require('body-parser');
const { request } = require('express');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // to parse JSON-encoded request bodies
app.use("/images", express.static('images'));

require('dotenv').config();

require('./db/connection');

//we link the router files
app.use(require('./router/userAuth'));
app.use(require('./router/memoryAuth'));
app.use(require('./router/memoryLikesAuth'));


const server = app.listen(5000,()=>{
    console.log('Server Started');
});