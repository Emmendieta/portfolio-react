import { genSaltSync, hashSync, compareSync } from "bcrypt";

const createHash = (password) => hashSync(password, genSaltSync(15));
const compareHash = (password, passwordBD) => compareSync(password, passwordBD);

export { createHash, compareHash };