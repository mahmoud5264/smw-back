require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    "Access-Control-Allow-Origin": "*",
  })
);

app.use(express.json());
const conect = async () => {
  await mongoose.connect(
    "mongodb://admin:5iiNXAlzWvb8ulQF@SG-smw-59213.servers.mongodirector.com:27017/admin?ssl=true",
    {
      ssl: true,
      sslValidate: false,
    }
  );
};

conect();
//  console.log(process.env.URL);
const formRouter = require("./routes/formRoute");
const authRouter = require("./routes/authRoute");
const logRouter = require("./routes/logRoute");
const classRouter = require("./routes/classRoute");
const backRouter = require("./routes/backupRoute");
const archiveRouter = require("./routes/archiveRoute");

// hostnamectl set-hostname smwback
app.use("/form", formRouter);
app.use("/auth", authRouter);
app.use("/logs", logRouter);
app.use("/class", classRouter);
app.use("/backup", backRouter);
app.use("/archive", archiveRouter);

app.listen(5000, () => {
  console.log(`server is running on port 5000`);
});
// ln -s /etc/nginx/sites-available/test.com /etc/nginx/sites-enabled/test.com
