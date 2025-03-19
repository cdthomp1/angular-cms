// server/routes/messages.js
var express = require('express');
var router = express.Router();
const Message = require('../models/message');
const sequenceGenerator = require('./sequenceGenerator');

// GET all messages
router.get('/', function (req, res, next) {
  Message.find()
    .populate('sender')
    .then(messages => {
      res.status(200).json({
        message: 'Messages fetched successfully!',
        messages: messages
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred while fetching messages',
        error: error
      });
    });
});

// POST a new message
router.post('/', function (req, res, next) {
  const maxMessageId = sequenceGenerator.nextId("messages");

  const message = new Message({
    id: maxMessageId.toString(),
    subject: req.body.subject,
    msgText: req.body.msgText,
    sender: req.body.sender || null
  });

  message.save()
    .then(createdMessage => {
      res.status(201).json({
        message: 'Message added successfully',
        messageData: createdMessage
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred while creating the message',
        error: error
      });
    });
});

// PUT (update) a message by ID
router.put('/:id', function (req, res, next) {
  Message.findOne({ id: req.params.id })
    .then(message => {
      if (!message) {
        return res.status(404).json({
          message: 'Message not found'
        });
      }
      // Update message properties from the request body
      message.subject = req.body.subject;
      message.msgText = req.body.msgText;
      message.sender = req.body.sender || message.sender;

      Message.updateOne({ id: req.params.id }, message)
        .then(result => {
          res.status(204).json({
            message: 'Message updated successfully'
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred while updating the message',
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

// DELETE a message by ID
router.delete('/:id', function (req, res, next) {
  Message.findOne({ id: req.params.id })
    .then(message => {
      if (!message) {
        return res.status(404).json({
          message: 'Message not found'
        });
      }
      Message.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: 'Message deleted successfully'
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred while deleting the message',
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
