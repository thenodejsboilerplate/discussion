/**
 * config
 */

var path = require('path');
let dbUsername = process.env.dbUsername
let dbPassword = process.env.dbPassword
let mongoPort = process.env.mongoPort || 27017
var config = {
  // debug 为 true 时，用于本地调试
  debug: false,

  get mini_assets() { return !this.debug; }, // 是否启用静态文件的合并压缩，详见视图中的Loader

  name: '2HOURS.CC', // 社区名字
  description: '2HOURS: Exclusive for expatriates in China', // 社区的描述
  keywords: 'expatriates, foreigner, English teacher',

  // 添加到 html head 中的信息
  site_headers: [
    '<meta name="author" content="Frank Lee" />'
  ],
  site_logo: '',//'/public/images/cnodejs_light.svg', // default is `name`
  site_icon: '',//'/public/images/cnode_icon_32.png', // 默认没有 favicon, 这里填写网址
  // 右上角的导航区
  site_navs: [
    // 格式 [ path, title, [target=''] ]
    [ '/about', 'About' ]
  ],
  // cdn host，如 http://cnodejs.qiniudn.com
  site_static_host: '', // 静态文件存储域名
  // 社区的域名
  host: 'localhost:3000',
  // 默认的Google tracker ID，自有站点请修改，申请地址：http://www.google.com/analytics/
  google_tracker_id: '',
  // 默认的cnzz tracker ID，自有站点请修改
  cnzz_tracker_id: '',

  // // mongodb 配置
  // db: 'mongodb://127.0.0.1/2hours',
  // mongodb 配置
  mongo: {
    port: mongoPort,
   // uri: `mongodb://localhost:${mongoPort}/test`, // ?authSource=groupForum
    options: {
      user: dbUsername || '',
      pass: dbPassword || '',
      db: { reconnectTries: Number.MAX_VALUE },
      server: {
        poolSize: 20
      }
    }
  },
  // redis 配置，默认是本地
  redis_host: '127.0.0.1',
  redis_port: 6379,
  redis_db: 0,
  redis_password: '',

  session_secret: 'iloveenen', // 务必修改
  auth_cookie_name: 'loveenen',

  // 程序运行的端口
  port: 3000,

  // 话题列表显示的话题数量
  list_topic_count: 20,

  // RSS配置
  rss: {
    title: '2HOURS.CC: Exclusive for expatriates',
    link: 'http://2hours.cc',
    language: 'en',
    description: '2HOURS: Expats in China',
    //最多获取的RSS Item数量
    max_rss_items: 50
  },

  log_dir: path.join(__dirname, 'logs'),

  // 邮箱配置
  mail_opts: {
    host: 'smtp.163.com',
    port: 465,//25,
    secure: true,//false,
    auth: {
      user: 'dongwenedu@163.com',
      pass: '548331198'
    },
    ignoreTLS: true
  },

  //weibo app key
  weibo_key: 10000000,
  weibo_id: 'your_weibo_id',

  // admin 可删除话题，编辑标签。把 user_login_name 换成你的登录名
  admins: { frank25184: true },

  // github 登陆的配置
  GITHUB_OAUTH: {
    clientID: 'your GITHUB_CLIENT_ID',
    clientSecret: 'your GITHUB_CLIENT_SECRET',
    callbackURL: 'http://cnodejs.org/auth/github/callback'
  },
  // 是否允许直接注册（否则只能走 github 的方式）
  allow_sign_up: true,

  // oneapm 是个用来监控网站性能的服务
  oneapm_key: '',

  // 下面两个配置都是文件上传的配置

  // 7牛的access信息，用于文件上传
  qn_access: {
    accessKey: 'your access key',
    secretKey: 'your secret key',
    bucket: 'your bucket name',
    origin: 'http://your qiniu domain',
    // 如果vps在国外，请使用 http://up.qiniug.com/ ，这是七牛的国际节点
    // 如果在国内，此项请留空
    uploadURL: 'http://xxxxxxxx',
  },

  // 文件上传配置
  // 注：如果填写 qn_access，则会上传到 7牛，以下配置无效
  upload: {
    path: path.join(__dirname, 'public/upload/'),
    url: '/public/upload/'
  },

  file_limit: '2MB',

  // 版块
  tabs: [
    ['share', 'Share'],
    ['ask', 'Ask'],
    ['job', 'Job'],
  ],

  // 极光推送
  jpush: {
    appKey: 'YourAccessKeyyyyyyyyyyyy',
    masterSecret: 'YourSecretKeyyyyyyyyyyyyy',
    isDebug: false,
  },

  create_post_per_day: 1000, // 每个用户一天可以发的主题数
  create_reply_per_day: 1000, // 每个用户一天可以发的评论数
  create_user_per_ip: 1000,
  visit_per_day: 1000, // 每个 ip 每天能访问的次数
};

if (process.env.NODE_ENV === 'test') {
  config.mongo = {
    port: 27017,
    uri: `mongodb://localhost:${mongoPort}/2hours?authSource=admin`,
    // uri: `mongodb://localhost:${mongoPort}/test`, // ?authSource=groupForum
     options: {
       user: dbUsername || '',
       pass: dbPassword || '',
       db: { reconnectTries: Number.MAX_VALUE },
       server: {
         poolSize: 20
       }
     }    
  }
  
  //'mongodb://127.0.0.1/discussion';
}

module.exports = config;
