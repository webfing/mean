'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
	HomeUrl: "http://192.168.1.190:8000",
	BossUrl: "http://192.168.1.190:9000",
	root: rootPath,
	port: process.env.PORT || 9000,
	mongo: {
		options: {
			db: {
				safe: true
			}
		}
	}
};