import { FormData } from '@/types/form';

// Simple in-memory storage for testing
// In production, use Vercel KV
class MemoryStorage {
  private static forms: Map<string, FormData> = new Map();

  static async saveFormData(formData: FormData): Promise<void> {
    this.forms.set(formData.id, formData);
    console.log('Form saved to memory:', formData.id);
  }

  static getFormData(formId: string): FormData | null {
    return this.forms.get(formId) || null;
  }

  static updateFormData(formId: string, updates: Partial<FormData>): void {
    const formData = this.forms.get(formId);
    if (formData) {
      Object.assign(formData, updates);
      formData.updatedAt = new Date().toISOString();
      this.forms.set(formId, formData);
    }
  }

  static async updateFormStatus(formId: string, status: 'in_progress' | 'completed'): Promise<void> {
    const formData = this.forms.get(formId);
    if (formData) {
      formData.status = status;
      formData.updatedAt = new Date().toISOString();
      this.forms.set(formId, formData);
    }
  }

  static async updateHeyGenVideoUrl(formId: string, videoUrl: string): Promise<void> {
    const formData = this.forms.get(formId);
    if (formData) {
      formData.heygenVideoUrl = videoUrl;
      formData.updatedAt = new Date().toISOString();
      this.forms.set(formId, formData);
    }
  }

  static async getCompletedFormsWithVideo(): Promise<FormData[]> {
    const forms: FormData[] = [];
    for (const form of this.forms.values()) {
      if (form.status === 'completed' && form.heygenVideoUrl) {
        forms.push(form);
      }
    }
    return forms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async getAllForms(): Promise<FormData[]> {
    return Array.from(this.forms.values());
  }
}

export { MemoryStorage };
