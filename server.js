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

  server.get("/thread", (req, res) =>{
    res.setHeader("Content-Type", "application/json");
    console.log("getting thread")
    res.json({});

  });

  server.get("/thread/:id", (req, res) =>{
    res.setHeader("Content-Type", "application/json");
    console.log(`getting thead with id: ${req.params.id}`);
    res.json({});
  })

  server.post("/thread", (req, res) =>{
    res.setHeader("Content-Type", "application/json");
    console.log("creating thread with body", req.body);
    res.json({});
  });

  server.delete("/thread/:id", (req, res) =>{
    res.setHeader("Content-Type", "application/json");
    console.log(`deleting thread with id: ${req.params.id}`)
    res.json({});
  })

  server.post("/post", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    console.log("creating post with body", req.body);
    res.json({});
  });

  server.delete("/post/:thread_id/:post_id", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    console.log(`deleting post with id: ${req.params.id}`);
    res.json({});
  });

// server.get("/thread", (req, res) => {
//     res.setHeader("Content-Type", "application/json");
//     console.log("getting all threads");
//     // return all of the todos in the store
//     res.send(JSON.stringify(store));
//   });

// server.get("/thread/:id", function(req, res){
//     res.setHeader("Content-Type", "application/json");
//     console.log(`getting thread with id: ${req.params.id}`)
//     if (store[req.params.id] === undefined){
//         res.status(404).send(
//             JSON.stringify({
//                 error: "not found",
//             })
//         );
//         return;
//     }
//     res.send(JSON.stringify(store[req.params.id]));
// })

// let nextID = 0;

// server.post("/thread", function (req, res){
//     res.setHeader("Content-Type", "application/json");
//     console.log(`creating a thread with body`, req.body);
//     req.body.id = nextID;
//     store[nextID] = req.body;
//     nextID++;
//     res.status(201).send(JSON.stringify(store[req.body.id]));
// });

// server.delete("/thread/:id", function(req, res){
//     res.setHeader("Content-Type", "application/json")
//     console.log(`deleting todo with id: ${req.params.id}`);
//     if (store[req.params.id] === undefined) {
//       res.status(404).send(
//         JSON.stringify({
//           error: "not found",
//         })
//       );
//       return;
//     }
//     let thread = store[req.params.id];
//     delete store[req.params.id];
//     res.send(JSON.stringify(thread));
// });

module.exports = server;