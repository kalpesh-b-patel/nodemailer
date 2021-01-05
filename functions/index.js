const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
admin.initializeApp();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${functions.config().gmail.email}`,
    pass: `${functions.config().gmail.password}`,
  },
});

exports.sendEmail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const { name, email, msg } = req.body;

    const mailOptions = {
      from: `kpatel.dev ${functions.config().gmail.email}`, // Something like: Jane Doe <janedoe@gmail.com>
      to: 'kalpeshpatel.it@gmail.com',
      subject: 'Contact form submitted!', // email subject
      html: `<p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Message: ${msg}</p>`,
    };

    return transporter.sendMail(mailOptions, (err, _) => {
      if (err) {
        return res.status(500).json({
          success: false,
          msg: 'Could not send message!',
        });
      }
      return res.status(200).json({
        success: true,
        msg: 'Message sent!',
      });
    });
  });
});
