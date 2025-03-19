// server/routes/documents.js
var express = require('express');
var router = express.Router();
const Document = require('../models/document');
const sequenceGenerator = require('./sequenceGenerator');

// GET all documents
router.get('/', function (req, res, next) {
  Document.find()
    .then(documents => {
      res.status(200).json({
        message: 'Documents fetched successfully!',
        documents: documents
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred while fetching documents',
        error: error
      });
    });
});

// POST a new document
router.post('/', function (req, res, next) {
  const maxDocumentId = sequenceGenerator.nextId("documents");

  const document = new Document({
    id: maxDocumentId.toString(),
    name: req.body.name,
    description: req.body.description,
    url: req.body.url,
    children: req.body.children || []
  });

  document.save()
    .then(createdDocument => {
      res.status(201).json({
        message: 'Document added successfully',
        document: createdDocument
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred while creating the document',
        error: error
      });
    });
});

// PUT (update) a document by ID
router.put('/:id', function (req, res, next) {
  Document.findOne({ id: req.params.id })
    .then(document => {
      if (!document) {
        return res.status(404).json({
          message: 'Document not found'
        });
      }
      document.name = req.body.name;
      document.description = req.body.description;
      document.url = req.body.url;
      document.children = req.body.children || [];

      Document.updateOne({ id: req.params.id }, document)
        .then(result => {
          res.status(204).json({
            message: 'Document updated successfully'
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred while updating the document',
            error: error
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// DELETE a document by ID
router.delete('/:id', function (req, res, next) {
  Document.findOne({ id: req.params.id })
    .then(document => {
      if (!document) {
        return res.status(404).json({
          message: 'Document not found'
        });
      }
      Document.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: 'Document deleted successfully'
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred while deleting the document',
            error: error
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

module.exports = router;
