const fs = require("fs");

let userMethods = {
  setUsers: function (data, callback) {
    fs.writeFile("./userDb.json", JSON.stringify(data), (err) => {
      if (err) {
        console.log("Error...writing file");
      } else {
        callback();
      }
    });
  },
  getUsers: function (callback) {
    fs.readFile("./userDb.json", "utf-8", (err, data) => {
      if (err) {
        console.log("Error...reading file");
      } else {
        let users;
        if (data.length === 0) {
          users = [];
        } else {
          users = JSON.parse(data);
        }
        callback(users);
      }
    });
  },
  getUser: function (email, callback) {
    this.getUsers(function (users) {
      let i = 0;
      for (i = 0; i < users.length; i++) {
        if (users[i].email === email) {
          callback(users, users[i]);
          break;
        }
      }
    });
  },
  userExist: function (email, callback) {
    this.getUsers(function (users) {
      let userExist = false;
      let i = 0;
      for (i = 0; i < users.length; i++) {
        if (users[i].email === email) {
          userExist = true;
          callback(users[i]);
          break;
        }
      }
      if (userExist === false) {
        callback(null);
      }
    });
  },
  tokenExist: function (token, callback) {
    this.getUsers(function (users) {
      let tokenExist = false;
      let i = 0;
      for (i = 0; i < users.length; i++) {
        if (users[i].mailToken == parseInt(token)) {
          tokenExist = true;
          callback(users[i]);
          console.log("Matched");
          break;
        }
        console.log(users[i]);
      }
      if (tokenExist === false) {
        callback(null);
      }
    });
  },
};

module.exports = userMethods;
