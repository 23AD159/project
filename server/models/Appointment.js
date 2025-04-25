const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    start: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: ['in-person', 'virtual'],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  symptoms: [{
    type: String
  }],
  notes: {
    type: String
  },
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  payment: {
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'refunded'],
      default: 'pending'
    },
    transactionId: String
  },
  meetingLink: {
    type: String
  },
  followUp: {
    required: Boolean,
    date: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ patient: 1, date: 1 });
appointmentSchema.index({ doctor: 1, date: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
