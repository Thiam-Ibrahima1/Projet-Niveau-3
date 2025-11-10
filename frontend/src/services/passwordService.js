class PasswordService {
  generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  sendOTP(email, otp) {
    const otpData = {
      email,
      otp,
      timestamp: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000
    };

    localStorage.setItem(`otp_${email}`, JSON.stringify(otpData));
    console.log(` OTP envoyé à ${email}: ${otp}`);
  }

  verifyOTP(email, otp) {
    const otpData = localStorage.getItem(`otp_${email}`);

    if (!otpData) {
      return false;
    }

    const { otp: storedOTP, expiresAt } = JSON.parse(otpData);

    if (Date.now() > expiresAt) {
      localStorage.removeItem(`otp_${email}`);
      return false;
    }

    if (storedOTP === otp) {
      localStorage.removeItem(`otp_${email}`);
      return true;
    }

    return false;
  }

  cleanupExpiredOTPs() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('otp_')) {
        const data = JSON.parse(localStorage.getItem(key));
        if (Date.now() > data.expiresAt) {
          localStorage.removeItem(key);
        }
      }
    }
  }
}

export const passwordService = new PasswordService();