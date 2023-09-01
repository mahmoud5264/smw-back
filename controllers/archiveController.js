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
app.use(express.json());
const conect = async () => {
   await mongoose.connect(
    "mongodb://admin:5iiNXAlzWvb8ulQF@SG-smw-59213.servers.mongodirector.com:27017/admin?ssl=true",{
  ssl: true,
  sslValidate: false
}
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
const Archive = require('./models/archiveModel')
app.post("/database", async (req, res) => {
  console.log(req.body);
   if (!req.body.pass || req.body.pass.trim() != "Qw123456@@")
     return res.status(400).json("invalid pass");

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
      "تاريخ ادخال البيانات"
    ],
    // Add more rows as needed
  ];
  let data = await Form.find({});
  data.forEach((doc) => {
    if(doc.beneficiary){
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
        x.push(doc.createdAt)
        csvData.push(x);
    }
  });
  console.log(data.length);
  const csvString = csvData.map((row) => row.join(",")).join("\n");

  // Set the appropriate headers
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="data.csv"');

  // Send the CSV data as the response body
  res.send(csvString);
});
app.post("/archive", async (req, res) => {
  console.log(req.body);
   if (!req.body.pass || req.body.pass.trim() != "Qw123456@@")
     return res.status(400).json("invalid pass");

  const csvData = [
    [
      "الكتاب",
      "الدائره",
      "العدد",
      "التاريخ",
      "كتابنا المرقم",
      " التاريخ",
      "الموظف"
    ],
  ];
   let data = await Archive.find({})

  data.forEach((doc) => {
      let x = [];
      x.push(doc.image);
      x.push(doc.region);
      x.push(doc.number);
      x.push(doc.date);
      x.push(doc.bookNumber);
      x.push(doc.date2);
      x.push(doc.user.fullName)
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

app.listen(5000, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
// ln -s /etc/nginx/sites-available/test.com /etc/nginx/sites-enabled/test.com
