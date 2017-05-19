var path = require('path');
var log4js = require('log4js');

var ROOT_DIR = path.join(__dirname, '/..');
var LOG_DIR = path.join(ROOT_DIR, '/../data/logs/');
var LOG_CONFIG = path.join(ROOT_DIR, '/configs/logger.json');

log4js.configure(LOG_CONFIG, {cwd: LOG_DIR});

module.exports = log4js;