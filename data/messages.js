module.exports = [
  {
    _id: Math.round(Math.random() * 1000000),
    text: "Say something... I'll tell you some fun facts! 🤣",
    createdAt: Date.now(),
    user: {
      _id: "chuck",
      name: "Chuck Norris"
    }
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: "Chat with Chuck!",
    createdAt: Date.now(),
    system: true
  }
];
