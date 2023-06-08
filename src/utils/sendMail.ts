import * as SIB from "@sendinblue/client";

const MailApiInstance = new SIB.TransactionalEmailsApi();
MailApiInstance.setApiKey(
  SIB.TransactionalEmailsApiApiKeys.apiKey,
  process.env.SIB_API_KEY!
);

const sendMail = async (data: SIB.SendSmtpEmail) => {
  try {
    await MailApiInstance.sendTransacEmail(data);
  } catch (err) {
    throw err;
  }
};

export default sendMail;
