var mongoose = require('mongoose');
var config   = require('../config');
var logger = require('../common/logger')
var mongodb = config.mongo;
mongoose.connect(`mongodb://${mongodb.options.user}:${mongodb.options.pass}@localhost:${mongodb.port}/2hours?authSource=2hours`, function (err) {
  if (err) {
    logger.error('connect to %s error: ', mongodb, err.message)
    process.exit(1)
  }
});

// mongoose.connect(config.mongo, {
//   server: {poolSize: 20}
// }, function (err) {
//   if (err) {
//     logger.error('connect to %s error: ', config.db, err.message);
//     process.exit(1);
//   }
// });

// models
require('./user');
require('./topic');
require('./reply');
require('./topic_collect');
require('./message');

exports.User         = mongoose.model('User');
exports.Topic        = mongoose.model('Topic');
exports.Reply        = mongoose.model('Reply');
exports.TopicCollect = mongoose.model('TopicCollect');
exports.Message      = mongoose.model('Message');
