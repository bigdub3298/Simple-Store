const sendgridMailer = require("@sendgrid/mail");
sendgridMailer.setApiKey(process.env.SG_API_KEY);

module.exports = sendgridMailer;
