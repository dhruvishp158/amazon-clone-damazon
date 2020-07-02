const mongoose = require("mongoose");
const secret = require("./secret");
//==============Async await===========
const connectDB = async () => {
  try {
    await mongoose.connect(secret.database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDB Connected..");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
