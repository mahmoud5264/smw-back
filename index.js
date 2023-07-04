require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
// const fileUpload = require("express-fileupload");
// app.use(
//   fileUpload()
// )
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    "Access-Control-Allow-Origin": "*",
  })
);
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(express.json());
const conect = async () => {
  await mongoose.connect(
    "mongodb+srv://actional79:azsbzxe5F1zr0tTG@cluster0.su8lkhz.mongodb.net/"
  );
};
/*
server {
  listen 80;
cp -r build/* /var/www/frontend

  server_name smwgoviraq.com www.smwgoviraq.com;
  location / {
         root /var/www/frontend;
         index  index.html index.htm;
         proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection 'upgrade';
         proxy_set_header Host $host;
         proxy_cache_bypass $http_upgrade;
         try_files $uri $uri/ /index.html;
  }
}
smwgoviraqss.com

server {
  listen 80;

  location / {
        proxy_pass http://31.187.72.67:8000 ;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
  }
}

server {
 listen 80;
 server_name smwgoviraq.com www.smwgoviraq.com;

location /app {
 root /var/www/frontend;
 index  index.html index.htm;
 proxy_http_version 1.1;
 proxy_set_header Upgrade $http_upgrade;
 proxy_set_header Connection 'upgrade';
 proxy_set_header Host $host;
 proxy_cache_bypass $http_upgrade;
 try_files $uri $uri/ /index.html;
}
}
server_name smw-gov.com
server {
  listen 80;
  location /api {
    proxy_pass http://31.187.72.67:8800;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
  location /app {
    root /var/www/frontend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

}

*/
conect();
// console.log(process.env.URL);
const formRouter = require("./routes/formRoute");
const authRouter = require("./routes/authRoute");
const logRouter = require("./routes/logRoute");
const classRouter = require("./routes/classRoute");
const backRouter = require("./routes/backupRoute");

// hostnamectl set-hostname smwback
app.use("/form", formRouter);
app.use("/auth", authRouter);
app.use("/logs", logRouter);
app.use("/class", classRouter);
app.use("/backup", backRouter);
const Form = require("./models/formModel");
app.get("/database", async (req, res) => {
  // Generate the CSV data or read it from a file
  //   [ "رقم معرف",
  //    "الاسم الكامل",
  //    "مسقط الراس",
  //    "المواليد",
  //    "الشريحه",
  //    "اسم الزوج",
  //    "رقم السجل",
  //    "رقم الصحيفه",
  //    "داضره الاحوال",
  //    "رقم القطعه",
  //    "المقاطعه",
  //    "المساحه",
  //    "تاريخ التخصيص",
  //    "مستفيد",
  // ]
  const csvData = [
    [
      "رقم معرف",
      "الاسم الكامل",
      "مسقط الراس",
      "المواليد",
      "الشريحه",
      "اسم الزوج",
      "رقم السجل",
      "رقم الصحيفه",
      "داضره الاحوال",
      "رقم القطعه",
      "المقاطعه",
      "المساحه",
      "تاريخ التخصيص",
      "مستفيد",
    ],
    // Add more rows as needed
  ];
  let data = await Form.find({});
  data.forEach((doc) => {
    let x = [];
    x.push(doc.formNumber);
    x.push(doc.fullName);
    x.push(doc.birhPlace);
    x.push(doc.birthDate);
    x.push(doc.classType);
    x.push(doc.husbandName);
    x.push(doc.recordNumber);
    x.push(doc.paperNumber);
    x.push(doc.department);
    x.push(doc.pieceNumber);
    x.push(doc.addressNubmer);
    x.push(doc.area);
    x.push(doc.assignDate);
    x.push(doc.beneficiary ? "مستفيد" : "غير مستفيد");
    csvData.push(x);
  });
  console.log(data.length);
  const csvString = csvData.map((row) => row.join(",")).join("\n");

  // Set the appropriate headers
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="data.csv"');

  // Send the CSV data as the response body
  res.send(csvString);
});

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
// ln -s /etc/nginx/sites-available/test.com /etc/nginx/sites-enabled/test.com
