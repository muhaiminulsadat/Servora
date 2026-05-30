export const mailTemplate = (fullName: string = "User", newOtp: string) => {
  return `Subject: Your Servora verification code

<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:#0f172a;padding:28px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">Servora</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">
              <p style="margin:0 0 8px;font-size:15px;color:#374151;">Hi ${fullName},</p>
              <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.6;">Use the verification code below to complete your registration on Servora. This code expires in <strong>5 minutes</strong>.</p>

              <!-- OTP Box -->
              <div style="background:#f8fafc;border:1.5px dashed #cbd5e1;border-radius:10px;padding:24px;text-align:center;margin-bottom:28px;">
                <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Your OTP</p>
                <p style="margin:0;font-size:38px;font-weight:700;letter-spacing:10px;color:#0f172a;font-family:'Courier New',monospace;">${newOtp}</p>
              </div>

              <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">If you did not request this code, you can safely ignore this email. Someone may have entered your email by mistake.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">© 2025 Servora · Built by Muhaiminul Islam Sadat</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
