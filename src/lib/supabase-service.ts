import { supabase } from './supabase';
import { FormData } from '@/types/form';

interface DbFormData {
  id: string;
  parent_name: string;
  student_name: string;
  student_age: number;
  current_grade: string;
  current_school: string;
  place_of_study: string;
  area_of_interest: string;
  phone_number: string;
  message: string;
  status: string;
  heygen_video_url: string | null;
  created_at: string;
  updated_at: string;
}

export class SupabaseService {
  static supabase = supabase;

  static isConfigured(): boolean {
    return !!(process.env.SL_SCHOOL_DEMO_SUPABASE_URL && process.env.SL_SCHOOL_DEMO_SUPABASE_SERVICE_ROLE_KEY);
  }

  static async saveFormData(formData: FormData): Promise<void> {
    const { error } = await supabase
      .from('forms')
      .insert({
        id: formData.id,
        parent_name: formData.parentName,
        student_name: formData.studentName,
        student_age: formData.studentAge,
        current_grade: formData.currentGrade,
        current_school: formData.currentSchool,
        place_of_study: formData.placeOfStudy,
        area_of_interest: formData.areaOfInterest,
        phone_number: formData.phoneNumber,
        message: formData.message,
        status: formData.status,
        heygen_video_url: formData.heygenVideoUrl,
        created_at: formData.createdAt,
        updated_at: formData.updatedAt
      });

    if (error) {
      console.error('Error saving form data:', error);
      throw new Error(`Failed to save form data: ${error.message}`);
    }
  }

  static async getFormData(formId: string): Promise<FormData | null> {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Form not found
      }
      console.error('Error getting form data:', error);
      throw new Error(`Failed to get form data: ${error.message}`);
    }

    return this.mapDbToFormData(data);
  }

  static async updateFormStatus(formId: string, status: 'in_progress' | 'completed'): Promise<void> {
    const { error } = await supabase
      .from('forms')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', formId);

    if (error) {
      console.error('Error updating form status:', error);
      throw new Error(`Failed to update form status: ${error.message}`);
    }
  }

  static async updateHeyGenVideoUrl(formId: string, videoUrl: string): Promise<void> {
    const { error } = await supabase
      .from('forms')
      .update({ 
        heygen_video_url: videoUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', formId);

    if (error) {
      console.error('Error updating HeyGen video URL:', error);
      throw new Error(`Failed to update HeyGen video URL: ${error.message}`);
    }
  }

  static async getCompletedFormsWithVideo(): Promise<FormData[]> {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('status', 'completed')
      .not('heygen_video_url', 'is', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting completed forms with video:', error);
      throw new Error(`Failed to get completed forms: ${error.message}`);
    }

    return data.map(this.mapDbToFormData);
  }

  static async getAllForms(): Promise<FormData[]> {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting all forms:', error);
      throw new Error(`Failed to get all forms: ${error.message}`);
    }

    return data.map(this.mapDbToFormData);
  }

  static async updateFormData(formId: string, updates: Partial<FormData>): Promise<void> {
    const updateData: Record<string, string> = {
      updated_at: new Date().toISOString()
    };

    if (updates.currentGrade !== undefined) updateData.current_grade = updates.currentGrade;
    if (updates.currentSchool !== undefined) updateData.current_school = updates.currentSchool;
    if (updates.placeOfStudy !== undefined) updateData.place_of_study = updates.placeOfStudy;
    if (updates.areaOfInterest !== undefined) updateData.area_of_interest = updates.areaOfInterest;
    if (updates.phoneNumber !== undefined) updateData.phone_number = updates.phoneNumber;
    if (updates.message !== undefined) updateData.message = updates.message;
    if (updates.status !== undefined) updateData.status = updates.status;

    const { error } = await supabase
      .from('forms')
      .update(updateData)
      .eq('id', formId);

    if (error) {
      console.error('Error updating form data:', error);
      throw new Error(`Failed to update form: ${error.message}`);
    }
  }

  private static mapDbToFormData(dbData: DbFormData): FormData {
    return {
      id: dbData.id,
      parentName: dbData.parent_name,
      studentName: dbData.student_name,
      studentAge: dbData.student_age,
      currentGrade: dbData.current_grade,
      currentSchool: dbData.current_school,
      placeOfStudy: dbData.place_of_study,
      areaOfInterest: dbData.area_of_interest,
      phoneNumber: dbData.phone_number,
      message: dbData.message,
      status: dbData.status as 'in_progress' | 'completed',
      heygenVideoUrl: dbData.heygen_video_url || undefined,
      createdAt: dbData.created_at,
      updatedAt: dbData.updated_at
    };
  }
}
