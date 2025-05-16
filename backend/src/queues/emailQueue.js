const Queue = require('bull');
const emailQueue = new Queue('email-reminder', { redis: { host: 'localhost', port: 6379 } });
module.exports = emailQueue;
