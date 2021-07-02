const express = require("express");
const cors = require("cors");

const server = express();
const store = require("./model")
server.use(cors());
server.use(express.json({}));

server.use((req, res, next) => {
    console.log(
      "Time: ",
      Date.now(),
      " - Method: ",
      req.method,
      " - Path: ",
      req.originalUrl,
      " - Body: ",
      req.body
    );
    next();
  });

server.get("/thread", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    console.log("getting all threads");
    // return all of the todos in the store
    res.send(JSON.stringify(store));
  });

server.get("/thread/:id", function(req, res){
    res.setHeader("Content-Type", "application/json");
    console.log(`getting thread with id: ${req.params.id}`)
    if (store[req.params.id] === undefined){
        res.status(404).send(
            JSON.stringify({
                error: "not found",
            })
        );
        return;
    }
    res.send(JSON.stringify(store[req.params.id]));
})

let nextID = 0;

server.post("/thread", function (req, res){
    res.setHeader("Content-Type", "application/json");
    console.log(`creating a thread with body`, req.body);
    req.body.id = nextID;
    store[nextID] = req.body;
    nextID++;
    res.status(201).send(JSON.stringify(store[req.body.id]));
});

module.exports = server;