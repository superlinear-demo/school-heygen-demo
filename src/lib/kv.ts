import { kv } from '@vercel/kv';
import { FormData } from '@/types/form';

export class KVService {
  private static readonly FORM_PREFIX = 'form:';
  private static readonly STATUS_PREFIX = 'status:';

  static async saveFormData(formData: FormData): Promise<void> {
    const key = `${this.FORM_PREFIX}${formData.id}`;
    await kv.set(key, JSON.stringify(formData));
  }

  static async getFormData(formId: string): Promise<FormData | null> {
    const key = `${this.FORM_PREFIX}${formId}`;
    const data = await kv.get<string>(key);
    return data ? JSON.parse(data) : null;
  }

  static async updateFormStatus(formId: string, status: 'in_progress' | 'completed'): Promise<void> {
    const formData = await this.getFormData(formId);
    if (formData) {
      formData.status = status;
      formData.updatedAt = new Date().toISOString();
      await this.saveFormData(formData);
    }
  }

  static async updateHeyGenVideoUrl(formId: string, videoUrl: string): Promise<void> {
    const formData = await this.getFormData(formId);
    if (formData) {
      formData.heygenVideoUrl = videoUrl;
      formData.updatedAt = new Date().toISOString();
      await this.saveFormData(formData);
    }
  }

  static async getCompletedFormsWithVideo(): Promise<FormData[]> {
    // This is a simplified implementation
    // In production, you might want to use a more efficient query method
    const keys = await kv.keys(`${this.FORM_PREFIX}*`);
    const forms: FormData[] = [];
    
    for (const key of keys) {
      const data = await kv.get<string>(key);
      if (data) {
        const formData = JSON.parse(data) as FormData;
        if (formData.status === 'completed' && formData.heygenVideoUrl) {
          forms.push(formData);
        }
      }
    }
    
    return forms;
  }
}
