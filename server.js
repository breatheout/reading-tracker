// type npm run devStart to keep the server running

//require("dotenv").config(); 10/05/2022 19:37 commented out

const express = require("express");
const path = require("path");
const app = express();

console.log(__filename);
console.log(__dirname);
console.log("////////////////////////");

const PORT = process.env.PORT || "8080";

const db = require("./config/db.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const Users = require("./sequelize-models/Users");
const Books = require("./sequelize-models/Books");
const CsvParser = require("json2csv").Parser;

db.sync();
//CHANGE ORIGIN WHEN FINISHED TESTING
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

//REGISTER USER
app.post("/api/register", async (req, res) => {
  try {
    console.log("entra en el try");
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };
    if (user.username && user.email && user.password) {
      console.log("hace la primera query");
      const query = await Users.findAll({
        attributes: ["username"],
        where: {
          username: user.username,
        },
      });
      if (!query.length) {
        console.log("query.lenght es false asi que anade el usuario");
        const newUser = await Users.create({
          username: user.username,
          email: user.email,
          password: user.password,
        });
        console.log("newUser auto-generated ID:", newUser.user_id);
        res.status(201).send({ message: "User created", statusCode: 201 });
      } else {
        //db.end();
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
  // Authenticate users starts
  console.log("empieza la funcion de login");
  const user = await Users.findAll({
    where: {
      username: req.body.username,
    },
  });
  /*.promise()
    .query(`SELECT * FROM USERS WHERE username='${req.body.username}'`);*/
  if (user == null) {
    console.log("dentro del user == null");
    return res.status(400).send("Cannot find user");
  }
  try {
    console.log("entra en el try");
    console.log("password is: ", user[0].password);
    const test = await bcrypt.compare(req.body.password, user[0].password);
    console.log("el bcrypt compare es", test);
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
      console.log("LOGIN CON EXITO");
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
  // Authenticate users ends
});

// DOWNLOAD USER DATA AS CSV - JWT - AMENDED - 06-05-2022
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

// DELETE ACCOUNT - JWT - AMENDED - 06-05-2022
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

// ADD BOOK TO TABLE - JWT - AMENDED - 06-05-2022
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

// DELETE BOOK FROM TABLE - JWT - AMENDED - 06-05-2022
app.delete("/api/book/delete", authenticateToken, async (req, res) => {
  Books.destroy({
    where: {
      bookId: req.body.bookId,
      username: req.user.username,
    },
  });
  res.status(204);
});

// CHECK IF USER HAS BOOK IN LIBRARY - JWT - AMENDED - 06-05-2022
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

//GET USER INFO - JWT - AMENDED - 06-05-2022
app.get("/api/user/info", authenticateToken, async (req, res) => {
  const user = await Users.findAll({
    attributes: ["user_id", "username", "email"],
    where: {
      username: req.user.username,
    },
  });
  res.json(user);
});

//UPDATE USER PASSWORD - JWT - AMENDED - 06-05-2022
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

//GET USER LIBRARY + GET BY TYPE - JWT - AMENDED 06/05/2022
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

//GET USER LIBRARY + GET BY TYPE - JWT - OBSERVABLES
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

//LOGOUT WITH JWT
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

app.get("/api/verify", (req, response) => {
  /*if (req.user.username) {
    return true;
  } else {
    return false;
  }*/
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  response = { authenticated: false };
  if (token == null) {
    return response;
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    response = { authenticated: false };
    if (err) return response;
    response = { authenticated: true };
    return response;
  });
});

//MIDDLEWARE TO AUTHENTICATE TOKENS AND ALLOW REQUESTS
function authenticateToken(req, res, next) {
  console.log("ha entrado en la verificacion");
  console.log(req.headers["authorization"]);
  const authHeader = req.headers["authorization"];
  console.log(req.headers);
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    console.log("ha entrado en token null");
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    console.log("ha entrado en la verificacion final");
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
  console.log(`Server is running on port ${PORT}.`);
});
