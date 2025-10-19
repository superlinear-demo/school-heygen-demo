import axios from 'axios';
import { HeyGenVideoRequest, HeyGenVideoResponse } from '@/types/form';

export class HeyGenService {
  private static readonly API_URL = process.env.HEYGEN_API_URL || 'https://api.heygen.com';
  private static readonly API_KEY = process.env.HEYGEN_API_KEY || process.env.HEYGEN_API_TOKEN;

  static async generateVideo(request: HeyGenVideoRequest): Promise<HeyGenVideoResponse | null> {
    try {
      const response = await axios.post(`${this.API_URL}/v1/video/generate`, {
        video_inputs: [
          {
            character: {
              type: 'avatar',
              avatar_id: 'c1926d821b4d43d6a5f07f2985bb5cd1', // Hardcoded avatar ID
              avatar_style: 'normal'
            },
            voice: {
              type: 'text',
              input_text: request.script,
              voice_id: '1bd001e7e50f421d891986aad5158bc3' // Default voice ID
            }
          }
        ],
        dimension: {
          width: 1080,
          height: 1920
        },
        aspect_ratio: '16:9'
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
