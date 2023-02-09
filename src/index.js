import app from "./app.js";
import connectDB from "./database.js";

connectDB();

app.listen(6660);
console.log("server on port", 6660);
