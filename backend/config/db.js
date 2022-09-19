const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
    });
    console.log("mongodb connected", con.connection.host);
  } catch (err) {
    console.log("unable to coonect to database", err.message);
    process.exit();
  }
};

module.exports = connectDB;
