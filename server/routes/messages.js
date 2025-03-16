// server/routes/messages.js
var express = require('express');
var router = express.Router();

// GET all messages
router.get('/', function (req, res, next) {
  // TODO: Implement logic to fetch messages from MongoDB
  res.json({ message: "GET all messages" });
});

// POST a new message
router.post('/', function (req, res, next) {
  // TODO: Implement logic to add a new message to MongoDB
  res.json({ message: "Message created" });
});

// PUT (update) a message by ID
router.put('/:id', function (req, res, next) {
  // TODO: Implement logic to update the message with the given id in MongoDB
  res.json({ message: `Message ${req.params.id} updated` });
});

// DELETE a message by ID
router.delete('/:id', function (req, res, next) {
  // TODO: Implement logic to delete the message with the given id from MongoDB
  res.json({ message: `Message ${req.params.id} deleted` });
});

module.exports = router;
