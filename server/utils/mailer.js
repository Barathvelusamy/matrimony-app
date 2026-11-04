const sendOtpEmail = async (to, name, otp) => {  if (process.env.MAIL_MODE === "console") {
    console.log(`[DEV OTP] ${to}: ${otp}`);
    return;
  }
  const key = process.env.MAILJET_API_KEY;
  const secret = process.env.MAILJET_SECRET_KEY;
  const sender = process.env.MAILJET_SENDER_EMAIL;

  if (!key || !secret || !sender) {
    throw new Error("Mailjet settings are missing");
  }

  const res = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(`${key}:${secret}`).toString("base64"),
    },
    body: JSON.stringify({
      Messages: [
        {
          From: { Email: sender, Name: "Matrimony App" },
          To: [{ Email: to, Name: name }],
          Subject: "Your Matrimony verification code",
          TextPart: `Hi ${name}, your verification code is ${otp}. It expires in 10 minutes.`,
          HTMLPart: `<div style="font-family:Arial,sans-serif">
            <h2 style="color:#6a1b9a">Matrimony App</h2>
            <p>Hi ${name},</p>
            <p>Your verification code is:</p>
            <p style="font-size:30px;font-weight:bold;letter-spacing:6px">${otp}</p>
            <p>This code expires in 10 minutes. If you did not register, ignore this email.</p>
          </div>`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mailjet error ${res.status}: ${text.slice(0, 200)}`);
  }
};

module.exports = { sendOtpEmail };