const Event = require('../models/Event');

exports.create = async (req, res) => {
  try {
    const { title, description, duration, availableDays, startTime, endTime } = req.body;
    if (!title || !duration || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const days = Array.isArray(availableDays) ? availableDays : String(availableDays || '')
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);
    const event = await Event.create({
      title,
      description,
      duration,
      availableDays: days,
      startTime,
      endTime,
      createdBy: req.user.id,
    });
    res.status(201).json({ event, bookingLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/book/${event._id}` });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

exports.list = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json({ events });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

exports.get = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ event });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};
