const chalk = require("chalk");
const mongoose = require("mongoose");
// _____________________________________________________________
const connectDB = async () => {
  try {
    const connec = await mongoose.connect(process.env.MONGO_URI, {});
    console.log(
      chalk.bold.yellow(`Connected to DB : ${connec.connection.host}`)
    );
  } catch (e) {
    console.log(chalk.red(e));
  }
};
// _____________________________________________________________
module.exports = connectDB;
