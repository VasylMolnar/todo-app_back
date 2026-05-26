import { db } from "../db";
import { Request, Response } from "express";

export const getTodos = (req: Request, res: Response) => {
  const start = Number(req.query["pagination[start]"]) || 0;
  const limit = Number(req.query["pagination[limit]"]) || 10;
  const category = req.query.category as string | undefined;

  db.get("SELECT COUNT(*) as count FROM todos", [], (err, countRow: any) => {
    if (err) return res.status(500).json(err);

    let query = "SELECT * FROM todos";
    const params: any[] = [];

    if (category && category !== "all") {
      query += " WHERE category = ?";
      params.push(category);
    }

    query += " LIMIT ? OFFSET ?";
    params.push(limit, start);

    db.all(query, params, (err, rows) => {
      if (err) return res.status(500).json(err);

      res.json({
        data: rows,
        meta: {
          pagination: {
            total: countRow.count,
            start,
            limit,
          },
        },
      });
    });
  });
};

export const createTodo = (req: Request, res: Response) => {
  const { title, description, category, completed } = req.body;

  db.get(
    "SELECT COUNT(*) as count FROM todos WHERE category = ?",
    [category],
    (err, row: any) => {
      if (err) return res.status(500).json(err);

      if (row.count >= 5) {
        return res.status(400).json({
          message: "Max 5 tasks per category",
        });
      }

      db.run(
        `INSERT INTO todos (title, description, category, completed)
         VALUES (?, ?, ?, ?)`,
        [title, description, category, completed ?? false],
        function (err) {
          if (err) return res.status(500).json(err);

          res.json({
            id: this.lastID,
            title,
            description,
            category,
            completed: completed ?? false,
          });
        },
      );
    },
  );
};

export const updateTodo = (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, category, completed } = req.body;

  if (!title || !category) {
    return res.status(400).json({
      message: "title and category required",
    });
  }

  db.run(
    `UPDATE todos
     SET title = ?,
         description = ?,
         category = ?,
         completed = ?
     WHERE id = ?`,
    [title, description ?? "", category, completed ? 1 : 0, id],
    (err) => {
      if (err) {
        console.log("SQL ERROR:", err);
        return res.status(500).json(err);
      }

      res.json({ success: true });
    },
  );
};
export const deleteTodo = (req: Request, res: Response) => {
  const { id } = req.params;

  db.run("DELETE FROM todos WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
};
