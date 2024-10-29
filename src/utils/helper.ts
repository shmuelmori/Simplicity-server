import { ServerResponse } from './types'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import OTPModel from '../models/otp.schema'

dotenv.config();

export const 
buildResponse = <T>(
  isSuccessful: boolean = false,
  displayMessage: string = 'Unknown message',
  description: string | null,
  exception: string | null = null,
  data: T | null = null
): ServerResponse<T> => {

  return {
    isSuccessful,
    displayMessage,
    description,
    exception,
    data,
  };
};

export const createToken = (id: string) => {

  const token = jwt.sign({ id: id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
  return token;
}

export const generateOTP = (length = 6) => {
  let otp = '';
  for(let i = 0; i < length; i++){
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}

const transporter = nodemailer.createTransport({
  service: 'gmail', // או כל שירות מייל אחר
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_CODE,
  },
});

export const sendEmail = async (email : string, otp: string) => {
  
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

export const saveOTPToDB = async (email: string, otp: string) => {
  const expirationTime = Date.now() + 300000; // 5 דקות תוקף
  // כאן תוסיף את הקוד למסד הנתונים
  await OTPModel.create({ email, otp, expiresAt: expirationTime });
};
