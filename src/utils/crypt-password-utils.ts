import bcrypt from "bcryptjs";

export const encryptPassword = (password: string) => {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) reject(err.message);
      else resolve(hash);
    });
  });
};

export const comparePasswords = (plaintextPassword: string, hash: string) => {
  return new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(plaintextPassword, hash, (err, success) => {
      if (err) return reject(err.message);
      return resolve(success);
    });
  });
};
