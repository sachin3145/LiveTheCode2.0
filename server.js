const mongoose = require('mongoose')
const dotenv = require('dotenv')  

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });

dotenv.config({ path: './config.env'});
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose
// .connect(process.env.DATABASE_LOCAL,{
.connect(DB, {
    useNewUrlParser: true,
}).then(con =>{
    // console.log(con.connections)
    console.log("Db is succeccfully connected")
});

// console.log(process.env)
const port = process.env.PORT || 8000;
app.listen(port,()=>{
    console.log(`Server started at ${port}`);
    
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });