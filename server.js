const express = require("express");
const cors = require("cors");

const server = express();
const { Thread } = require("./model")

server.use(cors());
server.use(express.json({}));
server.use(express.static('static'))

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
    console.log("getting thread")
    Thread.find({}, (err, threads) => {
      if (err != null) {
  
        res.status(500).json({
          error: err,
          message: "could not list threads"
        });
        return;
      }
      res.status(200).json(threads)
    });
  });

  server.get("/thread/:id", (req, res) =>{
    res.setHeader("Content-Type", "application/json");
    console.log(`getting thead with id: ${req.params.id}`);
    Thread.findById(req.params.id, ( err, thread ) => {
      if (err != null) {
        res.status(500).json({
          error: err,
          message: "could not get threads by id"
        });
        return; 
        } else if (thread === null) {
        res.status(404).json({
                message: `thread with id: ${req.params.id} does not exist`,
                error: err
            })
            return;
    }
      res.status(200).json(thread)
  });
});

  server.post("/thread", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    console.log(`creating a thread with body`, req.body);
  
    if (
        req.body.name === null || 
        req.body.name === undefined || 
        req.body.name === ""
        ) {
        console.log("name empty when creating thread");
        res.status(500).json({
            message: "unable to create thread",
            error: "name empty when creating thread",
        });
        return;
    } 
    if (
        req.body.author === null ||
        req.body.author === undefined ||
        req.body.author === ""
    ) {
        console.log("author empty when creating thread");
        res.status(500).json({
            message: "unable to create thread",
            error: "author empty when creating thread"
        });
        return
    } 
    if (
        req.body.description === null ||
        req.body.description === undefined ||
        req.body.description === ""
    ) {
        console.log("description empty when creating thread");
        res.status(500).json({
            message: "unable to create thread",
            error: "description empty when creating thread"
        });
        return;
    } 

  let creatingThread = {
      name: req.body.name || "",
      author: req.body.author || "",
      description: req.body.description || "",
      category: req.body.category || ""
  };

  Thread.create(creatingThread, (err, thread) =>{
      // check if there is an error
      if(err) {
          console.log(`unable to create thread`)
          res.status(500).json({
              message: "unable to create thread",
              error: err,
          });
          return;
      }
      res.status(201).json(thread);
  });
});

server.delete("/thread/:id", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log(`deleting thread with id: ${req.params.id}`);
 
  Thread.findByIdAndDelete(req.params.id, function(err, thread){
      if (err != null) {
          console.log(`There was an error finding a thread with id ${req.params.id}`)
          res.status(500).json({
                  message: `Unable to find thread with id ${req.params.id}`,
                  error: err
              });
          return; 
          } else if (thread === null) {
          res.status(404).json({
                  message: `thread with id: ${req.params.id} does not exist`,
                  error: err
              })
              return;
      }
        res.status(200).json(thread)
  });
});

  server.post("/post", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    console.log("creating post with body", req.body);

    let newPost = {
      author: req.body.author || "",
      body: req.body.body || "",
      thread_id: req.body.thread_id || ""
    };

    Thread.findByIdAndUpdate(req.body.thread_id, 
      { 
      $push: { posts: newPost },
      }, 
      {
        new: true,
      },
      (err, thread) => {
      if (err != null) {
        res.status(500).json({
          error: err,
          message: "could not get posts"
        });
        return; 
        } else if (thread === null) {
        res.status(404).json({
                message: `thread with id: ${req.params.id} does not exist`,
                error: err
            })
            return;
    }
    res.status(201).json(thread.posts[thread.posts.length - 1]);
    })
  });

  server.delete("/post/:thread_id/:post_id", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    console.log(`deleting post with id: ${req.params.post_id} on thread with id: ${req.params.thread_id}`);
    Thread.findByIdAndUpdate(req.params.thread_id, 
    {
      $pull: { 
        posts: {
          _id: req.params.post_id,
        }
      }
    },
    (err, thread) => {
      if (err != null) {
        res.status(500).json({
          error: err,
          message: "could not get posts"
        });
        return; 
        } else if (thread === null) {
        res.status(404).json({
                message: `thread with id: ${req.params.id} does not exist`,
                error: err
            });
            return;
      }
      let post;
      thread.posts.forEach((e) => {
        if (e._id == req.params.post_id) {
          post = e;
        }
      });
      if (post == undefined) {
        res.status(404).json({
          error: err,
          message: "could not find post"
        });
        return;
      }
        res.status(200).json(post)
      }
    );
  });



module.exports = server;