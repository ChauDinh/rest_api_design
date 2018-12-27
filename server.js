const app = require("./src/index");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/rest", { useNewUrlParser: true });

app.listen(6969);

process.on("uncaughtException", error => {
 console.log(error.message);
 console.log("---------------");
 process.exit(1);
});