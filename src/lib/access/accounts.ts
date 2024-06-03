import Cryptology from "../common/Cryptology";
import Mailer from "../common/Mailer";
import { readFileSync } from "fs";
import { join } from "path";
import accountsSchema, { AccountsDTO } from "./schemas/accountsSchema";

interface AccountResultDTO {
  result: string;
  message: string;
  account: AccountsDTO;
}

export const createAccount = async (account: AccountsDTO): Promise<AccountResultDTO> => {
  if (account.password === undefined) {
    throw new Error("Account password was emtpy.");
  }
  const newAccount = new accountsSchema({
    email: account.email,
    password: Cryptology.encrypt(account.password),
    username: account.username,
    fullname: account.fullname,
    role: account.role,
    applications: account.applications,
    active: false,
    activationCode: Cryptology.generateString(16),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  const savedAccount = await newAccount.save();
  return {
    result: "success",
    message: "Account created.",
    account: savedAccount,
  };
};

export const getAccount = async (account: AccountsDTO): Promise<AccountResultDTO> => {
  const foundAccount = await accountsSchema.findOne({ _id: account._id }).exec();
  if (foundAccount === null) {
    throw new Error("Could not find a account with the identifier.");
  }
  return {
    result: "success",
    message: "Found account with the identifier",
    account: foundAccount,
  };
};

export const sendActivationLink = async (email: string, activationCode: string) => {
  const i18n = JSON.parse(readFileSync(join(__dirname, "/public/i18n/fi.json"), "utf-8"));
  let subject = i18n.accountRegisteration.subject;
  let message = i18n.accountRegisteration.message.replace("{code}", activationCode);
  let sender = i18n.accountRegisteration.sender;
  return await Mailer.sendMail({ from: sender, to: email, subject: subject, text: message });
};

export const activateAccount = async (code: string): Promise<AccountResultDTO> => {
  const account = await accountsSchema.findOneAndUpdate({ activationCode: code }, { active: true }, { new: true }).exec();
  if (account == null) {
    throw new Error("Failed to activate account.");
  }
  return {
    result: "success",
    message: "Account activated",
    account: account,
  };
};
