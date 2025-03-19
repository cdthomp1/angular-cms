const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  imageUrl: { type: String, required: true },
  // The group property is an array of ObjectIds referencing other Contact documents.
  group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }]
});

module.exports = mongoose.model('Contact', contactSchema, 'contacts');
