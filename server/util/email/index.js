import nodemailer from 'nodemailer';
import config from '../../config/env';
import {logger} from '../logger';
import Bluebird from 'bluebird';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.secrets.gmailUser,
    pass: config.secrets.gmailPass
  }
});

const makeDupeEmail = (stats) => {
  let template = `
    Here are the results of your recent upload:


    Leads uploaded:   ${stats.uploaded} ✔
    Processing Time:  ${stats.duration} ✔
    Leads saved:         ${stats.saved} ✔
    Possible dupes:      ${stats.dupes} ✔
  `;

  if (stats.dupes && stats.dupeLink) {
    template += `\n

    Use this link to resolve possible duplicates
    ${stats.dupeLink}
    `;
  }

  const options = {
    from: 'LeadOn',
    to: config.secrets.emailTo,
    subject: 'LeadOn upload report 😎',
    text: template
  };

  return options;
};

const sendMail = (type, stats) => {
  return new Bluebird((yes, no) => {
    let ops;
    if (type === 'upload') {
      ops = makeDupeEmail(stats);
    }

    transporter.sendMail(ops, (err, info) => {
      err ? no(err) : yes(info);
    });
  });
};

export default sendMail;
