'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var PostSchema = new Schema({
  title: String,
  type: String,
  channel: String,
  brief: String,
  target: String,
  content: String,
  thumb: String,
  date: String,
  addtime: Number
});

mongoose.model('Post', PostSchema);
