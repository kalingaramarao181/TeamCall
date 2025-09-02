let userList = {};

const User = {
  add: (username, socketId) => {
    userList[username] = socketId;
  },
  remove: (username) => {
    delete userList[username];
  },
  getAll: () => {
    return Object.keys(userList);
  }
};

module.exports = User;
