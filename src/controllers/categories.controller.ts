import { db } from "../db";
import { Request, Response } from "express";

export const getCategories = (req: Request, res: Response) => {
  db.all("SELECT DISTINCT category FROM todos", [], (err, rows: any) => {
    if (err) return res.status(500).json(err);

    res.json(rows.map((r: any) => r.category));
  });
};
