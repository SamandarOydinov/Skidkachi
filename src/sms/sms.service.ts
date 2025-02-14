import { Injectable } from '@nestjs/common';
import axios from 'axios';
const FormData = require('form-data');

@Injectable()
export class SmsService {
  async sendSms(phone_number: string, otp: string) {
    const data = new FormData();
    data.append('mobile_phone', phone_number);
    // data.append('message', otp); 👇
    data.append('message', 'Bu Eskiz dan test');
    data.append('from', '4546');
    console.log(process.env.SMS_SERVICE_URL);

    // const getToekn = this.getToken()

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.SMS_SERVICE_URL,
      headers: {
        Authorization: `Bearer ${process.env.SMS_TOKEN}`,
      },
      data: data,
    };

    try {
      const response = await axios(config);
      return response;
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }
  async refreshToken() {}
  async getToken(email: string, password: string) {
    const data = new FormData();
    data.append('email', email);
    data.append('password', password);
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.GET_TOKEN_URL,
      data: data,
    };
    try {
      const response = await axios(config);
      return response;
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }
}
