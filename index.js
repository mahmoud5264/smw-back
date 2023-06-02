require('dotenv').config()
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require('node-cron');
// const fileUpload = require("express-fileupload");
// app.use(
//   fileUpload()
// );
app.use(cors());
app.use(express.json());
const conect = async()=>{
 await mongoose.connect("mongodb+srv://actional79:19991999abd@cluster0.su8lkhz.mongodb.net/");
}
conect()
console.log(process.env.URL);
const formRouter = require("./routes/formRoute");
const authRouter = require("./routes/authRoute");
const logRouter = require("./routes/logRoute");
const classRouter = require("./routes/classRoute");
const backRouter = require('./routes/backupRoute')

app.use("/form", formRouter);
app.use("/auth", authRouter);
app.use("/logs", logRouter);
app.use("/class", classRouter);
app.use('/backup' , backRouter)
app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
