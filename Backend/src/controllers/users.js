import { db } from "../database/db.js";

export const getUsers = (_, res) => {
  const q = "SELECT id, nome, email, senha FROM usuarios"

  db.query(q, (err, data) => {
    if (err) return res.json(err)
    return res.status(200).json(data)
  });
};
