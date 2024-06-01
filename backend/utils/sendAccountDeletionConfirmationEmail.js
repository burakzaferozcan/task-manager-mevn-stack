import sendEmail from "./sendEmail.js";
import generateToken from "./generateToken.js";

const sendAccountDeletionConfirmationEmail = async (email) => {
  try {
    const token = generateToken({ email }, "1d");
    const htmlContent = `<p>Account Deletion Confirmation: <a href="${process.env.BASE_SERVER_URL}/api/auth/delete-account/${token}">Confirm Deletion</a></p>`;
    await sendEmail(email, "Confirm Account Deletion", htmlContent);
  } catch (error) {
    throw new Error("Error sending confirmation email: " + error.message);
  }
};

export default sendAccountDeletionConfirmationEmail;
