const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "reading-tracker-app@outlook.com",
    pass: "reading12345",
  },
});

const options = {
  from: "reading-tracker-app@outlook.com",
  to: "breatheout18@gmail.com",
  subject: "Password reset | Reading Tracker",
  text: "Here goes your new password",
};

transporter.sendMail(options, function (err, info) {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Sent:" + info.response);
});
