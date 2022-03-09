const { assert } = require("chai");
const { getUserByEmail } = require("../helpers.js");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

describe("getUserByEmail", function () {
  it("should return a user with valid email", function () {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = true;
    assert.equal(expectedUserID, user);
  });

  it("should return undefined if email does not exist", function () {
    const user = getUserByEmail("person@example.com", testUsers);
    const expectedUserID = undefined;
    assert.equal(expectedUserID, user);
  });
});
