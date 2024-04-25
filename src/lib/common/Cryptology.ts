import { createHash } from "crypto";


// Compare password
const compare = (password: string, hash: string): boolean => {
  const hashedInputPassword = encrypt(password);
  return hashedInputPassword === hash;
};

// Helper function to hash password
const encrypt = (password: string): string => {
  const hash = createHash("sha256");
  hash.update(password);
  
  return hash.digest("hex");
};

// Generate random string
const generateString = (length: number): string => {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    result = result + characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export default {
  encrypt,
  compare,
  generateString
};
