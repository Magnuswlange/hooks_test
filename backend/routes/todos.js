const express = require("express");
const router = express.Router();
const pool = require("../db");

// !TODO: to get server-sent updates use server-side events (SSE) or websockets and listen for changes.

// middleware running every time an id parameter is passed to verify it's valid and sets todoId in the request.
router.param("id", async (req, res, next, value) => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid TodoItem id state" });
  }

  req.todoId = id;
  next();
});

// get all todos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todo_list ORDER BY id");

    if (result.rowCount === 0) {
      return res.status(200).json([]);
    }

    return res.json(result.rows);
  } catch (e) {
    console.log("DB Error: ", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// get specific todo
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todo_list WHERE id = $1", [
      req.todoId,
    ]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: `TodoItem with ID ${req.todoId} not found` });
    }

    return res.status(200).json(result.rows[0]);
  } catch (e) {
    console.log("DB Error: ", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// create new todo item
router.post("/", async (req, res) => {
  const content = req.body.content;
  if (typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({ error: "Invalid TodoItem content" });
  }

  const trimmed = content.trim();
  if (trimmed.length > 80) {
    return res
      .status(400)
      .json({ error: "Invalid TodoItem content length (max 80 chars)" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO todo_list (content) VALUES ($1) RETURNING *",
      [trimmed],
    );

    return res
      .status(201)
      .location(`/todos/${result.rows[0].id}`) // set the location header to tell the client where the created resource lives
      .json(result.rows[0]);
  } catch (e) {
    console.log("DB Error: ", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// update checked state
router.patch("/:id", async (req, res) => {
  if (typeof req.body.is_checked !== "boolean") {
    return res.status(400).json({ error: "Invalid TodoItem is_checked state" });
  }

  try {
    const result = await pool.query(
      "UPDATE todo_list SET is_checked=$1 WHERE id=$2",
      [req.body.is_checked, req.todoId],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: `No TodoItem with ID ${req.todoId} was found` });
    }

    return res.sendStatus(204);
  } catch (e) {
    console.log("DB Error: ", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// delete item
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM todo_list WHERE id=$1", [
      req.todoId,
    ]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: `No TodoItem with ID ${req.todoId} was found` });
    }

    return res.sendStatus(204);
  } catch (e) {
    console.log("DB Error: ", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
