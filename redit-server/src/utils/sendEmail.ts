import nodemailer from "nodemailer";

export const sendMail = async (to: string, html: string) => {
  //let testAccount = await nodemailer.createTestAccount();
  //console.log("testAccount", testAccount);
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "gcnoxp5hr2vyhnjd@ethereal.email", // generated ethereal user
      pass: "fB3q1avg5TSTafzDB6", // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to, // list of receivers
    subject: "Hello ✔", // Subject line
    html,
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
