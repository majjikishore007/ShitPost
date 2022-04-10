import nodemailer from "nodemailer";

export const sendMail = async (to: string, html: string) => {
  //let testAccount = await nodemailer.createTestAccount();
  //console.log("testAccount", testAccount);
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'gcnoxp5hr2vyhnjd@ethereal.email', // generated ethereal user
      pass: 'fB3q1avg5TSTafzDB6', // generated ethereal password
    },
    // host: 'smtp.mail.yahoo.com',
    // port: 465,
    // service: 'yahoo',
    // secure: false,
    // auth: {
    //   user: process.env.EMAIL_ADDRESS,
    //   pass: process.env.EMAIL_PASSWORD,
    // },
    // debug: false,
    // logger: true,
  });

  let info = await transporter.sendMail({
    from: `" Majji kishore👻" <${process.env.EMAIL_ADDRESS}>`, // sender address
    to, // list of receivers
    subject: 'Reset your password', // Subject line
    html,
  });

  console.log('Message sent: %s', info.messageId);

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
