const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.USERID}:${process.env.PASS}@cluster0.v4cwhr8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const tasksCollection = client.db("tasks").collection("task");
    const completedCollection = client.db("Completed").collection("task");


    //POST API -- http://localhost:5000/task
    // add task 
    app.post("/task", async (req, res) => {
      const data = req.body
      const result = await tasksCollection.insertOne(data);
      res.send(result);
    })

    //GET API -- http://localhost:5000/task
    // get task 
    app.get("/task", async (req, res) => {
      const query = req.query;
      const cursor = tasksCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });


    //delete data
    //url : http://localhost:5000/task/delete/:idnumber
    app.delete("/task/delete/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: ObjectId(id) };
      const deleteResult = await tasksCollection.deleteOne(filter);
      res.send(deleteResult);
    });


    //update data--
    //url : http://localhost:5000/task/update/:id 
    app.put("/task/update/:id", async (req, res) => {
      const data = req.body;
      const itemId = req.params.id;
      const query = { _id: ObjectId(itemId) };
      const updateDocument = {
        $set: { ...data },
      };
      const result = await tasksCollection.updateOne(query, updateDocument);
      res.send(result);
    });


    //POST API -- http://localhost:5000/completed
    // add task 
    app.post("/completed", async (req, res) => {
      const data = req.body
      const result = await completedCollection.insertOne(data);
      res.send(result);
    })

 

    //GET API -- http://localhost:5000/completedTask
    // get task 
    app.get("/completedTask", async (req, res) => {
      const query = req.query;
      const cursor = completedCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });


    //delete data
    //url : http://localhost:5000/completed/delete/:idnumber
    app.delete("/completed/delete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const deleteResult = await completedCollection.deleteOne(filter);
      res.send(deleteResult);
    });




  } finally {

    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Todo is working")
})

app.listen(port, () => {
  console.log('listen to port, ', port);
})