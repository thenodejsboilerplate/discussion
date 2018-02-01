var mailer        = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config        = require('../config');
var util          = require('util');
var logger = require('./logger');
var transporter     = mailer.createTransport(smtpTransport(config.mail_opts));
var SITE_ROOT_URL = 'http://' + config.host;
var async = require('async')

/**
 * Send an email
 * @param {Object} data 邮件对象
 */
var sendMail = function (data) {
  if (config.debug) {
    return;
  }

  // 重试5次
  async.retry({times: 5}, function (done) {
    transporter.sendMail(data, function (err) {
      if (err) {
        // 写为日志
        logger.error('send mail error', err, data);
        return done(err);
      }
      return done()
    });
  }, function (err) {
    if (err) {
      return logger.error('send mail finally error', err, data);
    }
    logger.info('send mail success', data)
  })
};
exports.sendMail = sendMail;

/**
 * 发送激活通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 */
exports.sendActiveMail = function (who, token, name) {
  var from    = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
  var to      = who;
  var subject = config.name + ' activate your account';
  var html    = '<p>Hello: ' + name + '</p>' +
    '<p>We have got' + ' your registeration，please click the link below to activate: </p>' +
    '<a href  = "' + SITE_ROOT_URL + '/active_account?key=' + token + '&name=' + name + '">Activating Link</a>' +
    '<p>If you have not made an account at ' + config.name + ', that means someone is using your email. Please delete this email and sorry for interuppting you.</p>' +
    '<p>' + config.name + ' Honestly</p>';

  exports.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};

/**
 * 发送密码重置通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 */
exports.sendResetPassMail = function (who, token, name) {
  var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
  var to = who;
  var subject = config.name + 'Reset Password';
  var html = '<p>Hello: ' + name + '</p>' +
    '<p>We have received your request at ' + config.name + 'for password resetting.Please click the link in 24 hours to modify your password:</p>' +
    '<a href="' + SITE_ROOT_URL + '/reset_pass?key=' + token + '&name=' + name + '">Reset Password Link</a>' +
    '<p>If you have not made a request at ' + config.name + ', that means someone is using your email. Please delete this email and sorry for interuppting you.</p>' +
    '<p>' + config.name + ' Honestly</p>';

  exports.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};
