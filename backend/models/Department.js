const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    headDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    floor: {
      type: String,
      default: "",
    },
    wing: {
      type: String,
      default: "",
    },
    contactNumber: {
      type: String,
      default: "",
    },
    totalBeds: {
      type: Number,
      default: 0,
    },
    availableBeds: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    colorCode: {
      type: String,
      default: "#3b82f6",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
