require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const todosRouter = require("./routes/todos");
const PORT = process.env.PORT;

const logger = (req, body, next) => {
  console.log(req.method, req.path);
  next(); // don't hang, run next
};

// middleware: function that runs between the request and route handler: req -> middleware -> res.
app.use(
  cors({
    origin: [
      "http://localhost:4000",
      "http://localhost:5173",
      "http://127.0.0.1:4000",
      "http://127.0.0.1:5173",
    ],
  }),
);
app.use(logger);
app.use(express.json());
app.use("/api/todos", todosRouter); // enable JSON body parsing whenever JSON in -> parse and put in req.body

app.listen(PORT, () => {
  console.log("Listening on port: ", PORT);
});
