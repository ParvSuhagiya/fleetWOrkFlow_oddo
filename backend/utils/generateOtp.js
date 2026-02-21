/**
 * Utility: Generate Random 6-Digit OTP
 * 
 * This function creates a random 6-digit OTP (000000 - 999999)
 * for email verification purposes.
 * 
 * Usage: generateOtp() => "123456"
 */

export const generateOtp = () => {
  // Generate random number between 0 and 999999
  // Pad with zeros to ensure 6 digits
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
};

export default generateOtp;
