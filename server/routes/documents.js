// server/routes/documents.js
var express = require('express');
var router = express.Router();

// GET all documents
router.get('/', function (req, res, next) {
  // TODO: Implement logic to fetch documents from MongoDB
  res.json({ message: "GET all documents" });
});

// POST a new document
router.post('/', function (req, res, next) {
  // TODO: Implement logic to add a new document to MongoDB
  res.json({ message: "Document created" });
});

// PUT (update) a document by ID
router.put('/:id', function (req, res, next) {
  // TODO: Implement logic to update the document with the given id in MongoDB
  res.json({ message: `Document ${req.params.id} updated` });
});

// DELETE a document by ID
router.delete('/:id', function (req, res, next) {
  // TODO: Implement logic to delete the document with the given id from MongoDB
  res.json({ message: `Document ${req.params.id} deleted` });
});

module.exports = router;
