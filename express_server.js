const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieSession = require('cookie-session')

const bcrypt = require('bcryptjs');

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

const {
  urlsForUser,
  passwordChk,
  hasUserId,
  getUserByEmail,
  generateRandomString,
} = require("./helpers");

const { urlDatabase, users} = require("./databases");

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


//GET
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//redirect links
app.get("/urls", (req, res) => {
  const user_id = req.session.user_id;
  let urls = urlsForUser(user_id, urlDatabase);
  const templateVars = {
    user: users[user_id],
    urls: urls,
    user_id: req.session.user_id
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let user_id = req.session.user_id;
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: req.params.longURL,
    user: users[user_id],
    user_id: req.session.user_id
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  if (!req.session.user_id || req.session.user_id !== urlDatabase[shortURL].userID) {
    return res.redirect("/login");
  }

  let user_id = req.session.user_id;
  const templateVars = {
    longURL: urlDatabase[req.params.id].longURL,
    shortURL: req.params.id,
    user: users[user_id],
    user_id: req.session.user_id
  };
  return res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL].longURL;
  if (shortURL == undefined || longURL == undefined) {
    return res.status(401).send("Inaccurate URL");
  }
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  let user_id = req.session.user_id;
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: req.params.longURL,
    users: users,
    user: users[user_id],
    user_id: req.session.user_id
  };
  res.render("urls_login", templateVars);
});

app.get("/register", (req, res) => {
  let user_id = req.session.user_id;
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: req.params.longURL,
    users: users,
    user: users[user_id],
    user_id: req.session.user_id
  };
  res.render("urls_register", templateVars);
});

//HomePage
app.get("/", (req, res) => {
  let user_id = req.session.user_id;
  const templateVars = { 
    user: users[user_id],
    user_id: req.session.user_id
  };
  res.render("urls_home", templateVars)
});




//POST
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const user_id = req.session.user_id;
  urlDatabase[shortURL] = {longURL: longURL, userID: user_id};
  res.redirect("/urls");
});

//post Logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password;
  let user_id = hasUserId(email, users);
  if (!email || !password) {
    return res.status(400).send("Please provide both an email and password");
    }
  if (passwordChk(email, password, users) && user_id) {
    req.session.user_id = user_id;
  } else {
    return res.status(400).send("Please provide valid email and/or password");
  }
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const id = generateRandomString(); 
  const user_id = id;
  const email = req.body.email.trim();
  const password = req.body.password;

  if (!email || !password) {
    return res.status(403).send("Please provide both an email and password");
  } else if (getUserByEmail(email, users)) {
    return res
      .status(403)
      .send("An account already exists for this email address");
  } else {
    users[id] = {user_id, email, password: bcrypt.hashSync(password, 10)}
    req.session.user_id = user_id;
  res.redirect("/urls");
  }
});

app.post("/urls/:id/update", (req, res) => {
  let shortURL = req.params.id;
  if(req.session.user_id !== urlDatabase[shortURL].userID){
    return res.status(401).send("Unauthorized URL Update");
  }
  let longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if(req.session.user_id !== urlDatabase[shortURL].userID){
    return res.status(401).send("Unauthorized URL Delete");
  }
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});