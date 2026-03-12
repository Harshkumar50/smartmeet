const Booking = require('../models/Booking');
const Event = require('../models/Event');

exports.create = async (req, res) => {
  try {
    const { eventId, visitorName, visitorEmail, meetingDate, meetingTime, purpose } = req.body;
    if (!eventId || !visitorName || !visitorEmail || !meetingDate || !meetingTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const booking = await Booking.create({
      eventId,
      visitorName,
      visitorEmail,
      meetingDate: new Date(meetingDate),
      meetingTime,
      purpose,
    });
    res.status(201).json({ booking });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

exports.list = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id }).select('_id');
    const ids = events.map((e) => e._id);
    const bookings = await Booking.find({ eventId: { $in: ids } })
      .populate('eventId', 'title')
      .sort({ meetingDate: 1, meetingTime: 1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

exports.byEvent = async (req, res) => {
  try {
    const bookings = await Booking.find({ eventId: req.params.eventId })
      .sort({ meetingDate: 1, meetingTime: 1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

exports.cancel = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('eventId');
    if (!booking?.eventId || booking.eventId.createdBy.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ booking });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};
