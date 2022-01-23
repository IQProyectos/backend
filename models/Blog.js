const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  name: { type: String, required: true, unique: true },
  entrada: { type: String, required: true },
  image: { type: String},
  projects: [{ type: Object, ref: 'Project'}],
  date: { type: String}
  
});

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;