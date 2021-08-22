const express = require("express");

const OurApp = express();
OurApp.get("/",(request , response) => {
    response.json({message :"Request served"});
});

OurApp.listen(4000, () => console.log("Server is running"));
//localhost4000 - rootroute