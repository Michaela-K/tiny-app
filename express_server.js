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

const users = { 
  "Wh1ym3": {
    user_id: "Wh1ym3", 
    email: "user@example.com", 
    password: "purple"
  },
 "M0rL0v": {
    user_id: "M0rL0v", 
    email: "user2@example.com", 
    password: "funky"
  }
}

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
  let user_id = req.cookies.user_id;
  console.log("user_id",user_id);
  const templateVars = { 
    users: users,
    urls: urlDatabase,
    user_id: req.cookies.user_id
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: req.params.longURL,
    users: users,
    user_id: req.cookies.user_id
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    longURL: urlDatabase[req.params.id].longURL,
    shortURL: req.params.id,
    users: users,
    user_id: req.cookies.user_id
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
    users: users,
    user_id: req.cookies.user_id
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
    users: users,
    user_id: req.cookies.user_id
  };
  res.render("urls_login", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: req.params.longURL,
    users: users,
    user_id: req.cookies.user_id
  };
  res.render("urls_register", templateVars);
});

//HomePage
app.get("/", (req, res) => {
  const templateVars = { 
    users: users,
    user_id: req.cookies.user_id
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
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // console.log("users email", users);

  // for(const user in users){
  //   // console.log(users[user].email);
  //   if(email === users[user].email){
  //     console.log("email", email);
  //     res.cookie(users[user].email);
  //     // console.log(res)
  // }
  // }
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const id = generateRandomString(); 
  const user_id = id;
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(403).send("Please provide both an email and password");
  } else if (getUserByEmail(email, users)) {
    return res
      .status(403)
      .send("An account already exists for this email address");
  } else {
    users[id] = {user_id, email, password}
    res.cookie("user_id", user_id);
    console.log(user_id, email, password);
  res.redirect("/urls");
  }
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

function getUserByEmail(email, users) {
  for (const user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
  return null;
}

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
