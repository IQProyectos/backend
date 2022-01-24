const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  objetives: { type: String, required: true },
  justification: { type: String, required: true },
  country: { type: String, required: true },
  department: { type: String, required: true },
  district: { type: String, required: true },
  definition: { type: String, required: true },
  isTimeSeries: { type: Boolean, required: true },
  percentage: { type: Number, required: false, default: 0},
  totalDays:{ type: Number, required: false, default: 0},
  nowDays:{ type: Number, required: false, default: 0},
  totalTasks:{ type: Number, required: false, default: 0},
  image: { type: String },
  programs: [{ type: Object, ref: 'Program'}],
  factors: [{ type: Object, ref: 'Factor'}]
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;