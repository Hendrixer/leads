import nodemailer from 'nodemailer';
import { config }  from '../../config/env';
import {logger} from '../logger';
import Bluebird from 'bluebird';
import fs from 'fs';
import _ from 'lodash';
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.secrets.gmailUser,
    pass: config.secrets.gmailPass
  }
});
let phoneTemplate = fs.readFileSync('./server/util/email/phones.html');
let leadTemplate = fs.readFileSync('./server/util/email/report.html');

const makeDupeEmail = (stats, toEmail) => {
  stats.mailto = stats.mailto || config.secrets.adminEmail;
  const template = _.template(leadTemplate)(stats);
  const options = {
    from: 'LeadOn',
    to: toEmail || config.secrets.emailTo,
    subject: 'LeadOn upload report 😎',
    html: template
  };

  return options;
};

const makePhoneEmail = (stats, toEmail) => {
  stats.mailto = stats.mailto || config.secrets.adminEmail;
  const template = _.template(phoneTemplate)(stats);
  const options = {
    from: 'LeadOn',
    to: toEmail || config.secrets.emailTo,
    subject: 'LeadOn phone supression report 😎',
    html: template
  };

  return options;
};

const sendMail = (type, stats, toEmail) => {
  return new Bluebird((yes, no) => {
    let ops;
    if (type === 'upload') {
      ops = makeDupeEmail(stats, toEmail);
    }

    if (type === 'phone') {
      ops = makePhoneEmail(stats, toEmail);
    }

    transporter.sendMail(ops, (err, info) => {
      err ? no(err) : yes(info);
    });
  });
};

export default sendMail;
