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
  // mongodb+srv://actional79:azsbzxe5F1zr0tTG@cluster0.su8lkhz.mongodb.net/
  // mongodb+srv://amr:xTfNdyROzSSRmctt@smw.qiwgvk4.mongodb.net/
  await mongoose.connect(
    "mongodb+srv://amr:xTfNdyROzSSRmctt@smw.qiwgvk4.mongodb.net/"
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


app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
// ln -s /etc/nginx/sites-available/test.com /etc/nginx/sites-enabled/test.com
