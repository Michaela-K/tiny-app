const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

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

// The : in front of id indicates that id is a route parameter. This means that the value in this part of the url will be available in the req.params object.
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: req.params.longURL 
  };
  res.render("urls_show", templateVars);
});

//When sending variables to an EJS template, we need to send them inside an object, even if we are only sending one variable. This is so we can use the key of that variable
app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase 
  };
  res.render("urls_index", templateVars);
});

//HomePage
app.get("/", (req, res) => {
  res.send("Hello!");
});




//POST