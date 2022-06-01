const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || "8080";

const db = require("./config/db.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const Users = require("./sequelize-models/Users");
const Books = require("./sequelize-models/Books");
const CsvParser = require("json2csv").Parser;
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  // Change service if not using outlook account or hotmail, nodemailer does not work well with gmail
  service: "hotmail",
  auth: {
    user: process.env.NODEMAILER_MAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

db.sync();
//CHANGE ORIGIN WHEN FINISHED TESTING
app.use(express.json());
app.use(
  cors({
    origin: "https://reading-tracker-application.herokuapp.com/",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// PASSWORD RESET
app.post("/api/reset", async (req, res) => {
  const password = require("crypto").randomBytes(8).toString("hex");
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = await Users.findAll({
    where: {
      username: req.body.username,
      email: req.body.email,
    },
  });
  if (query.length) {
    await Users.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          username: req.body.username,
          email: req.body.email,
        },
      }
    );
    const options = {
      from: "reading-tracker-app@outlook.com",
      to: req.body.email,
      subject: "Password reset | Reading Tracker",
      text:
        "You have asked to reset your password. This is your new password: " +
        password,
    };
    transporter.sendMail(options, function (err, info) {
      if (err) {
        return res.status(500).send(err);
      }
      return res.json(
        "Your password has been reset. Please check your email account."
      );
    });
  } else {
    return res.status(403).send();
  }
});

//REGISTER USER
app.post("/api/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };
    if (user.username && user.email && user.password) {
      const query = await Users.findAll({
        attributes: ["username"],
        where: {
          username: user.username,
        },
      });
      if (!query.length) {
        const newUser = await Users.create({
          username: user.username,
          email: user.email,
          password: user.password,
        });
        res.status(201).send({ message: "User created", statusCode: 201 });
      } else {
        res
          .status(422)
          .send({ message: "Username already taken", statusCode: 422 });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

//LOGIN AND AUTHENTICATE
app.post("/api/login", async (req, res) => {
  const user = await Users.findAll({
    where: {
      username: req.body.username,
    },
  });
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    const test = await bcrypt.compare(req.body.password, user[0].password);
    if (test) {
      const username = req.body.username;
      const userAux = { username: username };
      const access_token = generateAccessToken(userAux);
      const refresh_token = jwt.sign(userAux, process.env.REFRESH_TOKEN_SECRET);
      await Users.update(
        { access_token: refresh_token },
        {
          where: {
            username: req.body.username,
          },
        }
      );
      res.json({
        user_id: username,
        access_token: access_token,
        refresh_token: refresh_token,
      });
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

// DOWNLOAD USER DATA AS CSV
app.get("/api/download", authenticateToken, async (req, res) => {
  Books.findAll({
    where: {
      username: req.user.username,
    },
  }).then((objs) => {
    let results = [];
    objs.forEach((obj) => {
      const {
        bookId,
        shelf,
        title,
        pageCount,
        authors,
        genre,
        dateStart,
        dateFinished,
        cover,
        notes,
        rating,
        username,
      } = obj;
      results.push({
        bookId,
        shelf,
        title,
        pageCount,
        authors,
        genre,
        dateStart,
        dateFinished,
        cover,
        notes,
        rating,
        username,
      });
    });
    const csvFields = [
      "bookId",
      "shelf",
      "title",
      "pageCount",
      "authors",
      "genre",
      "dateStart",
      "dateFinished",
      "cover",
      "notes",
      "rating",
      "username",
    ];
    const csvParser = new CsvParser({ csvFields });
    const csvData = csvParser.parse(results);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=results.csv");
    res.status(200).end(csvData);
  });
});

// DELETE ACCOUNT
app.delete("/api/delete", authenticateToken, async (req, res) => {
  Books.destroy({
    where: {
      username: req.user.username,
    },
  });
  Users.destroy({
    where: {
      username: req.user.username,
    },
  });
  res.sendStatus(200);
});

// ADD BOOK TO TABLE
app.post("/api/book/add", authenticateToken, async (req, res) => {
  const username = req.user.username;
  const book = {
    id: req.body.id,
    shelf: req.body.shelf,
    title: req.body.title,
    pageCount: req.body.pageCount,
    authors: req.body.authors,
    genre: req.body.genre,
    dateStart: req.body.startDate,
    dateFinished: req.body.finishedDate,
    cover: req.body.cover,
    notes: req.body.notes,
    rating: req.body.rating,
  };
  if (username != null) {
    const query = await Books.findAll({
      where: {
        bookId: book.id,
        username: username,
      },
    });
    if (!query.length) {
      await Books.create({
        bookId: book.id,
        shelf: book.shelf,
        title: book.title,
        pageCount: book.pageCount,
        authors: JSON.stringify(book.authors),
        genre: JSON.stringify(book.genre),
        dateStart: book.dateStart,
        dateFinished: book.dateFinished,
        cover: book.cover,
        notes: book.notes,
        rating: book.rating,
        username: username,
      });
      res.status(201).send({ message: "Book added", statusCode: 201 });
    } else {
      await Books.update(
        {
          shelf: book.shelf,
          dateStart: book.dateStart,
          dateFinished: book.dateFinished,
          notes: book.notes,
          rating: book.rating,
        },
        {
          where: { bookId: book.id, username: username },
        }
      );
      res.status(422).send({ message: "Book updated", statusCode: 201 });
    }
  }
});

// DELETE BOOK FROM TABLE
app.delete("/api/book/delete", authenticateToken, async (req, res) => {
  Books.destroy({
    where: {
      bookId: req.body.bookId,
      username: req.user.username,
    },
  });
  res.status(204);
});

// CHECK IF USER HAS BOOK IN LIBRARY
app.get("/api/user/book/:bookId", authenticateToken, async (req, res) => {
  try {
    const username = req.user.username;
    const book = req.params.bookId;
    const query = await Books.findAll({
      where: {
        bookId: book,
        username: username,
      },
    });
    if (query.length) {
      res.json(query);
    }
  } catch {
    res.sendStatus(500);
  }
});

//GET USER INFO
app.get("/api/user/info", authenticateToken, async (req, res) => {
  const user = await Users.findAll({
    attributes: ["user_id", "username", "email"],
    where: {
      username: req.user.username,
    },
  });
  res.json(user);
});

//UPDATE USER PASSWORD
app.put("/api/user/password", authenticateToken, async (req, res) => {
  const user = await Users.findAll({
    where: {
      username: req.user.username,
    },
  });
  const test = await bcrypt.compare(req.body.old, user[0].password);
  const hashedPassword = await bcrypt.hash(req.body.new, 10);
  if (test) {
    await Users.update(
      { password: hashedPassword },
      {
        where: {
          username: req.user.username,
        },
      }
    );
    res.status(200).send({ message: "Passwords updated", statusCode: 200 });
  } else {
    res.status(401).send({ message: "Passwords don't match", statusCode: 401 });
  }
});

//GET USER LIBRARY + GET BY TYPE
app.post("/api/user/library", authenticateToken, async (req, res) => {
  let payload, query;
  if (req.body.type) {
    if (
      req.body.type != "reading" &&
      req.body.type != "read" &&
      req.body.type != "want to read" &&
      req.body.type != "unfinished"
    ) {
      return res.sendStatus(400);
    }
  }
  if (req.body.payload) {
    payload = req.body.payload;
  } else {
    payload = ["dateStart", "DESC"];
  }
  if (req.body.type) {
    query = await Books.findAll({
      order: [payload],
      where: {
        username: req.user.username,
        shelf: req.body.type,
      },
    });
  } else {
    query = await Books.findAll({
      order: [payload],
      where: {
        username: req.user.username,
      },
    });
  }
  res.json(query);
});

// NOT USED IN FINAL VERSION
//GET USER LIBRARY + GET BY TYPE - OBSERVABLE FOR INFINITE SCROLLING
app.post(
  "/api/observable/user/library/:pagenum/:pagesize",
  authenticateToken,
  async (req, res) => {
    let payload, query;
    if (req.body.type) {
      if (
        req.body.type != "reading" &&
        req.body.type != "read" &&
        req.body.type != "want to read" &&
        req.body.type != "unfinished"
      ) {
        return res.sendStatus(400);
      }
    }
    if (req.body.payload) {
      payload = req.body.payload;
    } else {
      payload = ["dateStart", "DESC"];
    }
    if (req.body.type) {
      query = await Books.findAll({
        order: [payload],
        where: {
          username: req.user.username,
          shelf: req.body.type,
        },
        limit: Number(req.params.pagesize),
        offset: Number(req.params.pagenum),
        subQuery: false,
      });
    } else {
      query = await Books.findAll({
        order: [payload],
        where: {
          username: req.user.username,
        },
      });
    }
    res.json(query);
  }
);

//LOGOUT
app.delete("/api/logout", authenticateToken, async (req, res) => {
  await Users.update(
    { access_token: "" },
    {
      where: {
        username: req.user.username,
      },
    }
  );
  res.sendStatus(204);
});

// NOT USED IN FINAL VERSION
//GENERATE ACCESS TOKENS
app.post("/api/token", async (req, res) => {
  const refresh_token = req.body.refresh_token;
  if (refresh_token == null) return res.sendStatus(401);
  const query = await Users.findAll({
    where: {
      refresh_token: refresh_token,
    },
  });
  if (!query.length) return res.sendStatus(403);
  jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const access_token = generateAccessToken({ username: user.username });
    res.json({ access_token: access_token });
  });
});

// API VERIFY FOR THE AUTH GUARD
app.get("/api/verify", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.json({ authenticated: false });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.json({ authenticated: false });
    return res.json({ authenticated: true });
  });
});

//MIDDLEWARE TO AUTHENTICATE TOKENS AND ALLOW REQUESTS
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// FUNCTION TO GENERATE TOKENS
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3600s",
  });
}

// SERVE STATIC FILES
app.use(express.static(__dirname + "/dist/reading-tracker"));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/reading-tracker/index.html"));
});

// LISTEN
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
