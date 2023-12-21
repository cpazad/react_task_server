const express = require("express");
const app = express();
const cors = require("cors");
// const jwt = require("jsonwebtoken");
require("dotenv").config();
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// server route

app.get("/", (req, res) => {
    res.send("Task Mangager is Present for the job");
  });
  
  app.listen(port, () => {
    console.log(`Task Manager is working at port ${port}`);
  });