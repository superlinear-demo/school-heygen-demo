import axios from 'axios';
import { WhatsAppMessage } from '@/types/form';

export class WhatsAppService {
  private static readonly API_URL = 'https://graph.facebook.com/v22.0';
  private static readonly PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.WHATSAPP_WABA;
  private static readonly ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

  static async sendMessage(message: WhatsAppMessage): Promise<boolean> {
    try {
      const url = `${this.API_URL}/${this.PHONE_NUMBER_ID}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        to: message.to,
        type: message.type,
        [message.type]: message[message.type]
      };

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      return response.status === 200;
    } catch (error) {
      console.error('WhatsApp message sending failed:', error);
      return false;
    }
  }

  static async sendVideoMessage(phoneNumber: string, videoUrl: string, caption?: string): Promise<boolean> {
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
