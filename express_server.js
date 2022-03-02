const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser')
app.use(cookieParser())



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


//GET
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//redirect links
//When sending variables to an EJS template, we need to send them inside an object, even if we are only sending one variable. This is so we can use the key of that variable
app.get("/urls", (req, res) => {
  let username = req.cookies.name;
  console.log("GET urls username",username);
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies.name
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: req.params.longURL,
    username: req.cookies.name
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    longURL: urlDatabase[req.params.id].longURL,
    shortURL: req.params.id,
    username: req.cookies.name
  };
  return res.render("urls_show", templateVars);
});
//is the urls/id the same as urls shortURL?


// The : in front of id indicates that id is a route parameter. This means that the value in this part of the url will be available in the req.params object.
//to show the user the newly created link
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: req.params.longURL,
    username: req.cookies.name
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: req.params.longURL,
    username: req.cookies.name
  };
  res.render("urls_login", templateVars);
});

//HomePage
app.get("/", (req, res) => {
  const templateVars = { 
    username: req.cookies.name
  };
  res.render("urls_home", templateVars)
});




//POST
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  console.log("shorturl & longURL", shortURL, longURL);
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

//post Logout
app.post("/logout", (req, res) => {
  res.clearCookie("name");
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  let username = req.body["username"];
  // console.log(username);
  res.cookie("name", username);
  res.redirect("/urls");
});

app.post("/urls/:id/update", (req, res) => {
  let shortURL = req.params.id;
  // console.log("shortURL: ", shortURL);
  let longURL = req.body.longURL;
  // console.log("longURL: ",longURL);
  urlDatabase[shortURL] = longURL;
  // console.log("store short & LongURL :", shortURL, longURL);
  res.redirect("/urls");
});

// app.post("/urls/:id", (req, res) => {
//   let shortURL = req.params.shortURL;
//   let longURL = req.body.longURL;
//   res.redirect("/urls");
// });

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});










//HELPER FUNCTIONS
function generateRandomString() {
  let length = 6;
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
generateRandomString();