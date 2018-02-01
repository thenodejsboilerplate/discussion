var eventproxy = require('eventproxy');
var validator  = require('validator');
var Topic      = require('../../proxy').Topic;
var User       = require('../../proxy').User;
var Reply      = require('../../proxy').Reply;
var at         = require('../../common/at');
var message    = require('../../common/message');
var config     = require('../../config');

var create = function (req, res, next) {
  var topic_id = req.params.topic_id;
  var content  = req.body.content || '';
  var reply_id = req.body.reply_id;

  var ep = new eventproxy();
  ep.fail(next);

  var str = validator.trim(content);
  if (str === '') {
    res.status(400);
    return res.send({success: false, error_msg: 'The replied content couldn\'t be blank!'});
  }

  if (!validator.isMongoId(topic_id)) {
    res.status(400);
    return res.send({success: false, error_msg: 'It\'s a valid topid id!'});
  }
  
  Topic.getTopic(topic_id, ep.done(function (topic) {
    if (!topic) {
      res.status(404);
      return res.send({success: false, error_msg: 'The topic doesn\'t exist!'});
    }
    if (topic.lock) {
      res.status(403);
      return res.send({success: false, error_msg: 'The topic has been locked!'});
    }
    ep.emit('topic', topic);
  }));

  ep.all('topic', function (topic) {
    User.getUserById(topic.author_id, ep.done('topic_author'));
  });

  ep.all('topic', 'topic_author', function (topic, topicAuthor) {
    Reply.newAndSave(content, topic_id, req.user.id, reply_id, ep.done(function (reply) {
      Topic.updateLastReply(topic_id, reply._id, ep.done(function () {
        ep.emit('reply_saved', reply);
        //发送at消息，并防止重复 at 作者
        var newContent = content.replace('@' + topicAuthor.loginname + ' ', '');
        at.sendMessageToMentionUsers(newContent, topic_id, req.user.id, reply._id);
      }));
    }));

    User.getUserById(req.user.id, ep.done(function (user) {
      user.score += 5;
      user.reply_count += 1;
      user.save();
      ep.emit('score_saved');
    }));
  });

  ep.all('reply_saved', 'topic', function (reply, topic) {
    if (topic.author_id.toString() !== req.user.id.toString()) {
      message.sendReplyMessage(topic.author_id, req.user.id, topic._id, reply._id);
    }
    ep.emit('message_saved');
  });

  ep.all('reply_saved', 'message_saved', 'score_saved', function (reply) {
    res.send({
      success: true,
      reply_id: reply._id
    });
  });
};

exports.create = create;

var ups = function (req, res, next) {
  var replyId = req.params.reply_id;
  var userId  = req.user.id;

  if (!validator.isMongoId(replyId)) {
    res.status(400);
    return res.send({success: false, error_msg: 'It\'s not a valid topic id!'});
  }
  
  Reply.getReplyById(replyId, function (err, reply) {
    if (err) {
      return next(err);
    }
    if (!reply) {
      res.status(404);
      return res.send({success: false, error_msg: 'The review does\'t exist!'});
    }
    if (reply.author_id.equals(userId) && !config.debug) {
      res.status(403);
      return res.send({success: false, error_msg: 'You cann\'t start yourself!'});
    } else {
      var action;
      reply.ups = reply.ups || [];
      var upIndex = reply.ups.indexOf(userId);
      if (upIndex === -1) {
        reply.ups.push(userId);
        action = 'up';
      } else {
        reply.ups.splice(upIndex, 1);
        action = 'down';
      }
      reply.save(function () {
        res.send({
          success: true,
          action: action
        });
      });
    }
  });
};

exports.ups = ups;
