const express = require("express");
const router = express.Router();
const pool = require("../db");
const TABLE_NAME = process.env.TABLE_NAME;

// !TODO: to get server-sent updates use server-side events (SSE) or websockets and listen for changes.

// middleware running every time an id parameter is passed to verify it's valid and sets todoId in the request.
router.param("id", async (req, res, next, value) => {
  console.log("middleware checking id parameter...");
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
    const result = await pool.query(`SELECT * FROM ${TABLE_NAME} ORDER BY id`);

    if (result.rows.length === 0) {
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
    // $1 is parameter one, e.g. WHERE id = $1 AND TITLE = $2, [id, title]
    const result = await pool.query(
      `SELECT * FROM ${TABLE_NAME} WHERE id = $1`,
      [req.todoId],
    );

    if (result.rows.length === 0) {
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
      `INSERT INTO ${TABLE_NAME} (content) VALUES ($1) RETURNING *`,
      [req.body.content],
    );

    return res.status(201).json(result.rows[0]);
  } catch (e) {
    console.log("DB Error: ", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// update checked state
router.patch("/:id", async (req, res) => {
  const is_checked = req.body.is_checked;
  if (typeof is_checked !== "boolean") {
    return res.status(400).json({ error: "Invalid TodoItem is_checked state" });
  }

  try {
    const result = await pool.query(
      `UPDATE ${TABLE_NAME} SET is_checked=$1 WHERE id=$2 RETURNING *`,
      [req.body.is_checked, req.todoId],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: `No TodoItem with ID ${req.todoId} was found` });
    }

    return res.sendStatus(200).json(result.rows[0]);
  } catch (e) {
    console.log("DB Error: ", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// delete item
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM ${TABLE_NAME} WHERE id=$1 RETURNING *`,
      [req.todoId],
    );

    if (result.rows.length === 0) {
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
