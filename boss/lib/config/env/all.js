'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
	HomeUrl: "http://www.qifun.net:8080",
	BossUrl: "http://boss.qifun.net:8000",
	root: rootPath,
	port: process.env.PORT || 8000,
	mongo: {
		options: {
			db: {
				safe: true
			}
		}
	}
};