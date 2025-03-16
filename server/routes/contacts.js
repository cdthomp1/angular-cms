// server/routes/contacts.js
var express = require('express');
var router = express.Router();

// GET all contacts
router.get('/', function (req, res, next) {
  // TODO: Implement logic to fetch contacts from MongoDB
  res.json({ message: "GET all contacts" });
});

// POST a new contact
router.post('/', function (req, res, next) {
  // TODO: Implement logic to add a new contact to MongoDB
  res.json({ message: "Contact created" });
});

// PUT (update) a contact by ID
router.put('/:id', function (req, res, next) {
  // TODO: Implement logic to update the contact with the given id in MongoDB
  res.json({ message: `Contact ${req.params.id} updated` });
});

// DELETE a contact by ID
router.delete('/:id', function (req, res, next) {
  // TODO: Implement logic to delete the contact with the given id from MongoDB
  res.json({ message: `Contact ${req.params.id} deleted` });
});

module.exports = router;
