import { db } from "../database/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerAluno = (req, res) => {
  const { email, nome, senha, matricula, curso } = req.body;

  const q = "SELECT * FROM usuarios WHERE email = ?";

  db.query(q, [email], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Erro no servidor", error: err });
    }
    if (data.length) {
      return res.status(409).json({ message: "Usuário já cadastrado!" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(senha, salt);

    const q2 = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";

    db.query(q2, [nome, email, hashedPassword], (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erro no servidor", error: err });
      }

      const usuarioID = data.insertId;

      const q3 =
        "INSERT INTO alunos (id_usuario, matricula, curso) VALUES (?, ?, ?)";

      db.query(q3, [usuarioID, matricula, curso], (err, data) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erro no servidor", error: err });
        }

        const idTurma = 1;
        const q4 = "INSERT INTO aluno_turma (idaluno, idturma) VALUES (?, ?)";
        db.query(q4, [usuarioID, idTurma], (err) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Erro no servidor", error: err });
          }
        });
        return res
          .status(200)
          .json({ message: "Aluno foi cadastrado com sucesso!" });
      });
    });
  });
};

export const registerProfessor = (req, res) => {
  const { email, nome, senha, matricula } = req.body;

  const q = "SELECT * FROM usuarios WHERE email = ?";

  db.query(q, [email], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Erro no servidor", error: err });
    }
    if (data.length) {
      return res.status(409).json({ message: "Usuário já cadastrado!" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(senha, salt);

    const q2 = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";

    db.query(q2, [nome, email, hashedPassword], (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erro no servidor", error: err });
      }
      const usuarioID = data.insertId;

      const q3 =
        "INSERT INTO professores (id_usuario, matricula) VALUES (?, ?)";

      db.query(q3, [usuarioID, matricula], (err, data) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erro no servidor", error: err });
        }
        const professorID = data.insertId;

        // IDs das turmas estáticos
        const turmas = [1, 2, 3, 4];

        // Inserindo na tabela professor_turma para cada turma
        turmas.forEach((idTurma) => {
          const q4 =
            "INSERT INTO professor_turma (idprofessor, idturma) VALUES (?, ?)";
          db.query(q4, [professorID, idTurma], (err) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Erro no servidor", error: err });
            }
          });
        });

        return res
          .status(200)
          .json({ message: "Professor foi cadastrado com sucesso!" });
      });
    });
  });
};

export const login = (req, res) => {
  const { email, senha } = req.body;

  const q = "SELECT * FROM usuarios WHERE email = ?";

  db.query(q, [email], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length === 0)
      return res.status(404).json("Usuário não encontrado");

    const senhaArmazenada = data[0].senha;

    const checkPassword = bcrypt.compareSync(senha, senhaArmazenada);

    if (!checkPassword) {
      return res.status(400).json("Senha ou email incorretos!");
    }

    const token = jwt.sign({ id: data[0].id }, "secretKey");

    const { senha: senhaUsuario, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: false, // Defina como true em produção
        sameSite: "strict",
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: false,
      sameSite: "none",
    })
    .status(200)
    .json("Usuario desconectado!");
};
