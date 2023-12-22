const express = require("express");
const app = express();
const cors = require("cors");
// const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yiwkd5s.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Database Collections
    const userCollection = client.db("taskDB").collection("users");
    const taskCollection = client.db("taskDB").collection("tasks");

    //------------------User Collection ---------------------

    // geting the all user collection
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    // sending user data to database from registration form
    app.post("/users", async (req, res) => {
      const user = req.body;
      //insert email if user does not exist
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists, insertedId:null" });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // ----------------------Task Collections ---------------------
   
    // Getting the task collection list
    app.get("/task", async (req, res) => {
        const result = await taskCollection.find().toArray();
        res.send(result);
      });
     
     // get individual task details based on query
     app.get("/task/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await taskCollection.findOne(query);
        res.send(result);
      });
      // Sending new task to the database,
      app.post("/task", async (req, res) => {
        const item = req.body;
        const result = await taskCollection.insertOne(item);
        res.send(result);
      });
      // Delete task Items,
    app.delete("/task/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await taskCollection.deleteOne(query);
        res.send(result);
      });  

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// server route

app.get("/", (req, res) => {
  res.send("Task Mangager is Present for the job");
});

app.listen(port, () => {
  console.log(`Task Manager is working at port ${port}`);
});
