const mongoose = require('mongoose');
const URI = process.env.MONGODB_URL;

//Connect to mongodb
mongoose.connect(URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{console.log("Connected to database")})
.catch(e=>console.log(e)) 