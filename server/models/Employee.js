
const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive', 'On Leave'], default: 'Active' },
  profilePicture: { type: String },
  dateOfJoining:{type: String},
  probationEndDate: { type: Date, required: true },
  createdBy: { type: String }, // Admin or Manager who added the employee
  modifiedBy: { type: String }, // Admin or Manager who last updated the employee data
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);
