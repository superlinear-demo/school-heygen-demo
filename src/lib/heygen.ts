import axios from 'axios';
import { HeyGenVideoRequest, HeyGenVideoResponse } from '@/types/form';

export class HeyGenService {
  private static readonly API_URL = process.env.HEYGEN_API_URL || 'https://api.heygen.com';
  private static readonly API_KEY = process.env.HEYGEN_API_KEY || process.env.HEYGEN_API_TOKEN;

  static async generateVideo(request: HeyGenVideoRequest): Promise<HeyGenVideoResponse | null> {
    try {
      const requestBody = {
        video_inputs: [
          {
            character: {
              type: 'avatar',
              avatar_id: 'Daphne_public_1', // group id - c1926d821b4d43d6a5f07f2985bb5cd1 Hardcoded avatar ID
              avatar_style: 'normal'
            },
            voice: {
              type: 'text',
              input_text: request.script,
              voice_id: '97dd67ab8ce242b6a9e7689cb00c6414' // Updated voice ID
            }
          }
        ],
        dimension: {
          height: 720,
          width: 1280
        },
        background: {
          "type": "video",
          "video_asset_id": "fortes_education",
          "play_style": "loop"
        },
        aspect_ratio: '16:9'
      };

      console.log('🎬 HeyGen Video Generation Request:');
      console.log('URL:', `${this.API_URL}/v2/video/generate`);
      console.log('Headers:', {
        'X-Api-Key': this.API_KEY ? `${this.API_KEY.substring(0, 10)}...` : 'NOT_SET',
        'Content-Type': 'application/json'
      });
      console.log('Request Body:', JSON.stringify(requestBody, null, 2));

      const response = await axios.post(`${this.API_URL}/v2/video/generate`, requestBody, {
        headers: {
          'X-Api-Key': this.API_KEY,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ HeyGen Video Generation Response:');
      console.log('Status:', response.status);
      console.log('Headers:', response.headers);
      console.log('Response Body:', JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error) {
      console.error('❌ HeyGen video generation failed:');
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Headers:', error.response.headers);
        console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
      } else if (axios.isAxiosError(error) && error.request) {
        console.error('Request made but no response received:', error.request);
      } else {
        console.error('Error setting up request:', error instanceof Error ? error.message : 'Unknown error');
      }
      console.error('Full Error:', error);
      return null;
    }
  }

  static async getVideoStatus(videoId: string): Promise<HeyGenVideoResponse | null> {
    try {
      const url = `${this.API_URL}/v1/video_status.get?video_id=${videoId}`;
      
      console.log('📊 HeyGen Video Status Request:');
      console.log('URL:', url);
      console.log('Video ID:', videoId);
      console.log('Headers:', {
        'X-Api-Key': this.API_KEY ? `${this.API_KEY.substring(0, 10)}...` : 'NOT_SET'
      });

      const response = await axios.get(url, {
        headers: {
          'X-Api-Key': this.API_KEY
        }
      });

      console.log('✅ HeyGen Video Status Response:');
      console.log('Status:', response.status);
      console.log('Headers:', response.headers);
      console.log('Response Body:', JSON.stringify(response.data, null, 2));

      // Extract video status from the response structure
      const responseData = response.data;
      if (responseData && responseData.data) {
        return {
          video_id: videoId,
          status: responseData.data.status || 'processing',
          video_url: responseData.data.video_url
        };
      }

      return responseData;
    } catch (error) {
      console.error('❌ HeyGen video status check failed:');
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Headers:', error.response.headers);
        console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
      } else if (axios.isAxiosError(error) && error.request) {
        console.error('Request made but no response received:', error.request);
      } else {
        console.error('Error setting up request:', error instanceof Error ? error.message : 'Unknown error');
      }
      console.error('Full Error:', error);
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
