export interface FormData {
  id: string;
  parentName: string;
  studentName: string;
  studentAge: number;
  currentGrade: string;
  currentSchool: string;
  placeOfStudy: string;
  areaOfInterest: string;
  phoneNumber: string;
  message: string;
  status: 'in_progress' | 'completed';
  heygenVideoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Step1Data {
  parentName: string;
  studentName: string;
  studentAge: number;
}

export interface Step2Data {
  currentGrade: string;
  currentSchool: string;
  placeOfStudy: string;
  areaOfInterest: string;
}

export interface Step3Data {
  phoneNumber: string;
  message: string;
}

export interface HeyGenVideoRequest {
  script: string;
  voice: string;
  avatar: string;
}

export interface HeyGenVideoResponse {
  video_id: string;
  status: string;
  video_url?: string;
}

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'video';
  text?: {
    body: string;
  };
  video?: {
    link: string;
    caption?: string;
  };
}
