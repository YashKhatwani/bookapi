require("dotenv").config(); //importingdotnev
const express = require("express"); //imported express
const mongoose = require("mongoose");

//database -imported
//const Database = require("./database");

//importing API
const Book = require("./API/book");
const Author = require("./API/author");
const Publication = require("./API/publication");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("connection established"))
  .catch((err) => {
    console.log(err);
  });
//symbol " / " is known as route

//Initialization
const OurApp = express();

//It makes us able to pass json and read json data
OurApp.use(express.json());

//Microservices
OurApp.use("/book",Book);
OurApp.use("/author",Author);
OurApp.use("/publication",Publication);

OurApp.get("/", (request, response) => {
  response.json({ message: "Server is working!!" });
});

OurApp.listen(4000, () => console.log("Server is running"));
//localhost4000 - rootroute


//npm run dev - to run server
