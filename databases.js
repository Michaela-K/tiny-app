const bcrypt = require("bcryptjs");

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "Wh1ym3"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "M0rL0v"
  }
};

const users = { 
  "Wh1ym3": {
    user_id: "Wh1ym3", 
    email: "user@example.com", 
    password: bcrypt.hashSync("password", 10)
  },
 "M0rL0v": {
    user_id: "M0rL0v", 
    email: "user2@example.com", 
    password: bcrypt.hashSync("password", 10)
  }
}


module.exports = { urlDatabase, users };