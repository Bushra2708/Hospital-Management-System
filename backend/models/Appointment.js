const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["consultation", "follow-up", "emergency", "routine", "specialist"],
      default: "consultation",
    },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },
    symptoms: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    prescription: {
      type: String,
      default: "",
    },
    diagnosis: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      default: 30,
    },
    cancelReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
