import axios from 'axios';
import { HeyGenVideoRequest, HeyGenVideoResponse } from '@/types/form';

export class HeyGenService {
  private static readonly API_URL = process.env.HEYGEN_API_URL || 'https://api.heygen.com';
  private static readonly API_KEY = process.env.HEYGEN_API_KEY;

  static async generateVideo(request: HeyGenVideoRequest): Promise<HeyGenVideoResponse | null> {
    try {
      const response = await axios.post(`${this.API_URL}/v1/video/generate`, {
        script: request.script,
        voice: request.voice || 'en-US-AriaNeural',
        avatar: request.avatar || 'default'
      }, {
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('HeyGen video generation failed:', error);
      return null;
    }
  }

  static async getVideoStatus(videoId: string): Promise<HeyGenVideoResponse | null> {
    try {
      const response = await axios.get(`${this.API_URL}/v1/video/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('HeyGen video status check failed:', error);
      return null;
    }
  }

  static generateScript(parentName: string, studentName: string, studentFirstName: string): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextDayDate = tomorrow.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `Hello ${parentName}, How are you? how is ${studentFirstName}, we are excited to welcome ${studentName} to Fortes Education ecosystem. Your interactive session at Dubai school campus has been scheduled on ${nextDayDate} at 10:30AM, Excited to meet ${studentFirstName}.`;
  }
}
