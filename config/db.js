const mongoose = require("mongoose");

//==============Async await===========
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Dhruvish:Dhruvish@dmazon-uqk7p.mongodb.net/dmazon?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );
    console.log("MongoDB Connected..");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
