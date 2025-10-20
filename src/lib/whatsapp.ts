import axios from 'axios';
import { WhatsAppMessage } from '@/types/form';

export class WhatsAppService {
  private static readonly API_URL = 'https://graph.facebook.com/v22.0';
  private static readonly PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.WHATSAPP_WABA;
  private static readonly ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

  static async sendMessage(message: WhatsAppMessage): Promise<boolean> {
    try {
      const url = `${this.API_URL}/${this.PHONE_NUMBER_ID}/messages`;
      
      console.log('📱 WhatsApp API Request:');
      console.log('URL:', url);
      console.log('Phone Number ID:', this.PHONE_NUMBER_ID);
      console.log('Access Token:', this.ACCESS_TOKEN ? `${this.ACCESS_TOKEN.substring(0, 10)}...` : 'NOT_SET');
      
      const payload = {
        messaging_product: 'whatsapp',
        to: message.to,
        type: message.type,
        [message.type]: message[message.type]
      };

      console.log('📤 WhatsApp Payload:', JSON.stringify(payload, null, 2));

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ WhatsApp Response:');
      console.log('Status:', response.status);
      console.log('Headers:', response.headers);
      console.log('Data:', JSON.stringify(response.data, null, 2));

      return response.status === 200;
    } catch (error) {
      console.error('❌ WhatsApp message sending failed:');
      if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Headers:', error.response.headers);
        console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.error('Request made but no response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      console.error('Full Error:', error);
      return false;
    }
  }

  static async sendVideoMessage(phoneNumber: string, videoUrl: string, caption?: string): Promise<boolean> {
    console.log('📹 Sending WhatsApp video message...');
    console.log('📞 To:', phoneNumber);
    console.log('🎬 Video URL:', videoUrl);
    console.log('📝 Caption:', caption);
    
    const message: WhatsAppMessage = {
      to: phoneNumber,
      type: 'video',
      video: {
        link: videoUrl,
        caption: caption || 'Welcome to Fortes Education! Here\'s your personalized video message.'
      }
    };

    return await this.sendMessage(message);
  }

  static async sendTextMessage(phoneNumber: string, text: string): Promise<boolean> {
    const message: WhatsAppMessage = {
      to: phoneNumber,
      type: 'text',
      text: {
        body: text
      }
    };

    return await this.sendMessage(message);
  }

  static getDemoPhoneNumbers(): string[] {
    const demoNumbers = process.env.DEMO_PHONE_NUMBERS || process.env.PHONE_LIST || '919538055505';
    return demoNumbers.split(',');
  }
}
