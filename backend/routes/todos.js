const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos");

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No TodoItem(s) were found" });
    }

    return res.json(result.rows);
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid TodoItem ID" });
  }

  try {
    // $1 is parameter one, e.g. WHERE id = $1 AND TITLE = $2, [id, title]
    const result = await pool.query("SELECT * FROM todos WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: `TodoItem with ID ${id} not found` });
    }

    return res.json(result.rows[0]);
  } catch (e) {
    console.log("DB Error: ", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const { title, checked } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Invalid TodoItem title" });
  }

  if (typeof checked !== "boolean") {
    return res.status(400).json({ error: "Invalid TodoItem checked state" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO todos (title, checked) VALUES ($1, $2) RETURNING *",
      [title, checked],
    );

    return res.status(201).json(result.rows[0]);
  } catch (e) {
    console.log("DB Error: ", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
