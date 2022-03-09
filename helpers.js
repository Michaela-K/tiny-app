const bcrypt = require("bcryptjs");

//HELPER FUNCTIONS
function urlsForUser(user_id, urlDatabase) {
  let userUrl = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === user_id) {
      userUrl[url] = urlDatabase[url].longURL;
    }
  }
  return userUrl;
}

function passwordChk(email, password, users) {
  for (const user in users) {
    if (
      users[user].email === email &&
      bcrypt.compareSync(password, users[user].password)
    ) {
      return true;
    }
  }
  return false;
}

function hasUserId(email, users) {
  for (const user in users) {
    console.log("1", user.email);
    console.log("2", users[user].email);
    console.log("3", users[user][email]);
    console.log("4", users[user]["email"]);

    if (users[user]["email"] === email) {
      return users[user].user_id;
    }
  }
  return false;
}

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

module.exports = {
  urlsForUser,
  passwordChk,
  hasUserId,
  getUserByEmail,
  generateRandomString,
};
