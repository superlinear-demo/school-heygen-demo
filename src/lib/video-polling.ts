import { HeyGenService } from './heygen';
import { WhatsAppService } from './whatsapp';
import { SupabaseService } from './supabase-service';
import { MemoryStorage } from './memory-storage';

export class VideoPollingService {
  private static pollingInterval: NodeJS.Timeout | null = null;
  private static readonly POLL_INTERVAL = 10000; // 10 seconds
  private static readonly MAX_POLL_ATTEMPTS = 60; // 10 minutes max

  static startPolling() {
    if (this.pollingInterval) {
      console.log('📊 Video polling already running');
      return;
    }

    console.log('🚀 Starting video status polling...');
    console.log('⏰ Polling interval:', this.POLL_INTERVAL, 'ms');
    
    this.pollingInterval = setInterval(async () => {
      console.log('🔄 Polling cycle started...');
      await this.checkPendingVideos();
    }, this.POLL_INTERVAL);
    
    console.log('✅ Video polling service started successfully');
  }

  static stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      console.log('🛑 Video polling stopped');
    }
  }

  private static async checkPendingVideos() {
    try {
      console.log('🔍 Checking for pending videos...');
      
      // Get all forms that are completed but don't have a video URL yet
      const completedForms = await this.getCompletedFormsWithoutVideo();
      
      if (completedForms.length === 0) {
        console.log('✅ No pending videos found');
        return;
      }

      console.log(`📋 Found ${completedForms.length} pending videos`);
      console.log('📋 Forms:', completedForms.map(f => ({ id: f.id, status: f.status, hasVideoId: !!f.heygenVideoId, hasVideoUrl: !!f.heygenVideoUrl })));

      for (const form of completedForms) {
        console.log(`🎬 Processing form ${form.id}...`);
        await this.processFormVideo(form);
      }
    } catch (error) {
      console.error('❌ Error checking pending videos:', error);
    }
  }

  private static async getCompletedFormsWithoutVideo() {
    try {
      console.log('🔍 Getting completed forms without video...');
      
      // Try Supabase first
      if (SupabaseService.isConfigured()) {
        console.log('💾 Using Supabase to get forms...');
        const { data, error } = await SupabaseService.supabase
          .from('forms')
          .select('*')
          .eq('status', 'completed')
          .is('heygen_video_url', null);

        if (error) {
          console.error('❌ Supabase error:', error);
          return [];
        }

        console.log(`📊 Found ${data?.length || 0} completed forms without video in Supabase`);
        return data || [];
      } else {
        console.log('💾 Using memory storage to get forms...');
        // Fallback to memory storage
        const allForms = MemoryStorage.getAllForms();
        const filteredForms = allForms.filter(form => 
          form.status === 'completed' && !form.heygenVideoUrl
        );
        console.log(`📊 Found ${filteredForms.length} completed forms without video in memory`);
        return filteredForms;
      }
    } catch (error) {
      console.error('❌ Error getting completed forms:', error);
      return [];
    }
  }

  private static async processFormVideo(form: any) {
    try {
      console.log(`🎬 Processing video for form ${form.id}...`);
      console.log(`📋 Form data:`, { 
        id: form.id, 
        status: form.status, 
        videoId: form.heygenVideoId || form.heygen_video_id,
        videoUrl: form.heygenVideoUrl || form.heygen_video_url 
      });

      // Check if we have a video ID to poll
      const videoId = form.heygenVideoId || form.heygen_video_id;
      if (!videoId) {
        console.log(`⚠️ No video ID found for form ${form.id}, skipping...`);
        return;
      }

      console.log(`🔍 Polling HeyGen for video status: ${videoId}`);
      // Poll HeyGen for video status
      const videoStatus = await HeyGenService.getVideoStatus(videoId);
      
      if (!videoStatus) {
        console.log(`❌ Failed to get video status for form ${form.id}`);
        return;
      }

      console.log(`📊 Video status for form ${form.id}:`, videoStatus);

      if (videoStatus.status === 'completed' && videoStatus.video_url) {
        console.log(`✅ Video ready for form ${form.id}! URL: ${videoStatus.video_url}`);
        
        // Update form with video URL
        await this.updateFormWithVideoUrl(form.id, videoStatus.video_url);
        
        // Send WhatsApp message
        await this.sendWhatsAppMessage(form, videoStatus.video_url);
        
      } else if (videoStatus.status === 'failed') {
        console.log(`❌ Video generation failed for form ${form.id}`);
        // Could update form status to 'video_failed' or similar
      } else {
        console.log(`⏳ Video still processing for form ${form.id} (${videoStatus.status})`);
      }
    } catch (error) {
      console.error(`❌ Error processing video for form ${form.id}:`, error);
    }
  }

  private static async updateFormWithVideoUrl(formId: string, videoUrl: string) {
    try {
      if (SupabaseService.isConfigured()) {
        const { error } = await SupabaseService.supabase
          .from('forms')
          .update({ heygen_video_url: videoUrl })
          .eq('id', formId);

        if (error) {
          console.error('Error updating form with video URL:', error);
        } else {
          console.log(`✅ Updated form ${formId} with video URL`);
        }
      } else {
        // Update memory storage
        const form = MemoryStorage.getFormData(formId);
        if (form) {
          form.heygenVideoUrl = videoUrl;
          MemoryStorage.updateFormData(formId, { heygenVideoUrl: videoUrl });
          console.log(`✅ Updated form ${formId} with video URL in memory`);
        }
      }
    } catch (error) {
      console.error('Error updating form with video URL:', error);
    }
  }

  private static async sendWhatsAppMessage(form: any, videoUrl: string) {
    try {
      console.log(`📱 Sending WhatsApp message for form ${form.id}...`);
      console.log(`📋 Form details:`, {
        parentName: form.parent_name || form.parentName,
        studentName: form.student_name || form.studentName,
        videoUrl
      });
      
      const phoneNumbers = WhatsAppService.getDemoPhoneNumbers();
      console.log(`📞 Available phone numbers:`, phoneNumbers);
      
      if (phoneNumbers.length === 0) {
        console.log('⚠️ No phone numbers configured for WhatsApp');
        return;
      }

      const parentName = form.parent_name || form.parentName;
      const studentName = form.student_name || form.studentName;
      const message = `Hello ${parentName}! 🎉\n\nWe're excited to welcome ${studentName} to Fortes Education! Here's your personalized welcome video:\n\n${videoUrl}\n\nWe look forward to meeting you soon!`;

      console.log(`📝 WhatsApp message:`, message);

      for (const phoneNumber of phoneNumbers) {
        try {
          console.log(`📤 Sending WhatsApp to ${phoneNumber}...`);
          await WhatsAppService.sendVideoMessage(phoneNumber, videoUrl, message);
          console.log(`✅ WhatsApp message sent to ${phoneNumber}`);
        } catch (error) {
          console.error(`❌ Failed to send WhatsApp to ${phoneNumber}:`, error);
        }
      }
    } catch (error) {
      console.error('❌ Error sending WhatsApp message:', error);
    }
  }
}
