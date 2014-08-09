'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Thing Schema
 */
var JobSchema = new Schema({
    title: String,
    type: String,
    place: String,
    responsibility: String,
    applyers: {type:Number, default: 0},
    require: String,
    priority: String,
    other: String,
    number: Number,
    date: String,
    addtime: Number
});

mongoose.model('Job', JobSchema);
