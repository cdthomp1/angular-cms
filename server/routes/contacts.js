// server/routes/contacts.js
var express = require('express');
var router = express.Router();
const Contact = require('../models/contact');
const sequenceGenerator = require('./sequenceGenerator');

// GET all contacts with populated group property
router.get('/', function (req, res, next) {
  Contact.find()
    .populate('group')
    .then(contacts => {
      res.status(200).json({
        message: 'Contacts fetched successfully!',
        contacts: contacts
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred while fetching contacts',
        error: error
      });
    });
});

// POST a new contact
router.post('/', function (req, res, next) {
  const maxContactId = sequenceGenerator.nextId("contacts");

  const contact = new Contact({
    id: maxContactId.toString(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    imageUrl: req.body.imageUrl,
    group: req.body.group || []
  });

  contact.save()
    .then(createdContact => {
      res.status(201).json({
        message: 'Contact added successfully',
        contact: createdContact
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred while creating the contact',
        error: error
      });
    });
});

// PUT (update) a contact by ID
router.put('/:id', function (req, res, next) {
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      if (!contact) {
        return res.status(404).json({
          message: 'Contact not found'
        });
      }
      // Update properties from request body
      contact.name = req.body.name;
      contact.email = req.body.email;
      contact.phone = req.body.phone;
      contact.imageUrl = req.body.imageUrl;
      contact.group = req.body.group || [];

      Contact.updateOne({ id: req.params.id }, contact)
        .then(result => {
          res.status(204).json({
            message: `Contact ${req.params.id} updated successfully`
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred while updating the contact',
            error: error
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Contact not found',
        error: error
      });
    });
});

// DELETE a contact by ID
router.delete('/:id', function (req, res, next) {
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      if (!contact) {
        return res.status(404).json({
          message: 'Contact not found'
        });
      }
      Contact.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: `Contact ${req.params.id} deleted successfully`
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred while deleting the contact',
            error: error
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Contact not found',
        error: error
      });
    });
});

module.exports = router;
