const mongoose = require("mongoose");

// This file is in charge of database connection


function connect(callback) {
  let connectionString = `mongodb+srv://ryann:thisIsIt12@cluster0.mfcyu.mongodb.net/codeschool_forum?retryWrites=true&w=majority`;

  console.log("connect to db....");

  mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err) => {
      console.log("There was an error connecting to mongo: ", err);
    });

  mongoose.connection.once("open", callback);
}

module.exports = connect;