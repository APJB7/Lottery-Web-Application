const nodemailer = require("nodemailer");

async function main() {
  const testAccount = await nodemailer.createTestAccount();

  console.log("SMTP_HOST=smtp.ethereal.email");
  console.log("SMTP_PORT=587");
  console.log("SMTP_USER=" + testAccount.user);
  console.log("SMTP_PASS=" + testAccount.pass);
}

main();