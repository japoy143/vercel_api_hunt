const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive
}

const generateOTP = () => {
  const Num1 = getRandomInt(0, 10);
  const Num2 = getRandomInt(0, 10);
  const Num3 = getRandomInt(0, 10);
  const Num4 = getRandomInt(0, 10);
  const Otp = `${Num1} ${Num2} ${Num3} ${Num4}`;

  return Otp;
};

const Otp = generateOTP();

const hashedOtp = () => {
  const split = Otp.split(" ");
  const alphabet = "zeawxybcdgh";
  const encrypt = split.map((alp) => alphabet[parseInt(alp)]);

  const encrypted = encrypt.flat();

  return encrypted;
};

const hashedData = hashedOtp();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.EMAIL_KEY,
  },
});

const sendMail = (req, res) => {
  const { email, subject, message } = req.body;
  console.log(email, subject, message);

  let mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "Confirmation Code",
    text: Otp,
  };

  transporter
    .sendMail(mailOptions)
    .then(() => {
      console.log(`Email Send Successfully ${hashedData}`);
      return res.json(hashedData);
    })
    .catch((err) => console.log(err));
};

module.exports = { sendMail };
