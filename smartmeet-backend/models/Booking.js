const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  visitorName: { type: String, required: true, trim: true },
  visitorEmail: { type: String, required: true, trim: true, lowercase: true },
  meetingDate: { type: Date, required: true },
  meetingTime: { type: String, required: true },
  purpose: { type: String, trim: true },
  status: { type: String, enum: ['scheduled', 'cancelled', 'completed'], default: 'scheduled' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
