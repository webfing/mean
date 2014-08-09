'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Thing Schema
 */
var ApplyerSchema = new Schema({
    name: String,
    email: String,
    jobType: {type:Schema.Types.ObjectId,ref:'Job'},
    phone: String,
    brief: String,
    accessory: String,
    remark: String,
    marked: Boolean,
    show: Boolean,
    date: String,
    addtime: Number
});

mongoose.model('Applyer', ApplyerSchema);
