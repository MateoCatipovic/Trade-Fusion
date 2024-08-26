export const validatePassword = (password) => {
  const passwordLength = password.length >= 5;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password); // Check for at least one letter

  if (!passwordLength) {
    return "Password must be at least 5 characters long.";
  } else if (!hasNumber) {
    return "Password must contain at least one number.";
  } else if (!hasLetter) {
    return "Password must contain at least one letter.";
  } else if (!hasSpecialChar) {
    return 'Password must contain at least one special character from the set [!@#$%^&*(),.?":{}|<>].';
  } else {
    return "";
  }
};
