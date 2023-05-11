const express = require('express')
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config({ path: '.env' });

//http://localhost:8000/api/signup
//http://localhost:8000/api/signin

//import routes
const authRoutes = require('./routes/auth');
const { db } = require('./models/User');

//console.log(process.env.DATABASE)
/*
mongoose.connect() is an asynchronous method that returns a promise. When you call
mongoose.connect() to establish a connection to a MongoDB database, it will 
return a promise that will resolve when the connection is successfully 
established or reject if there is an error.*/

// db
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(() => console.log('DB Connected'))
  .catch((error) => console.log("error connecting to DB", error));


const cors = require('cors')
app.use(cors())
app.use(bodyParser.json());
//app.use(express.json())

app.get('/hello', (req, res) => {
  res.send("hello world")
})

app.use('/api', authRoutes);

const port = 8000
app.listen(port, () => {
  console.log(`server started on ${port}`)
})