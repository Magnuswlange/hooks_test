require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const todosRouter = require("./routes/todos");

const logger = (req, body, next) => {
  console.log(req.method, req.path);
  next(); // dont hang, run next
};

// middleware: function that runs between the request and route handler: req -> middleware -> res.
app.use(cors({ origin: ["http://localhost:4000", "http://127.0.0.1:4000"] }));
app.use(logger);
app.use(express.json());
app.use("/todos", todosRouter); // enable JSON body parsing whenver JSON in -> parse and put in req.body

// end points
app.get("/", (req, res) => {
  res.send("my first response");
});

app.get("/about", (req, res) => {
  res.send("about");
});

app.listen(process.env.PORT, () => {
  console.log("Listening on port: ", process.env.PORT);
});
