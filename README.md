# School Welcome - Admission Form

A Next.js application for collecting school admission forms with integrated HeyGen video generation and WhatsApp messaging.

## Features

- **3-Step Admission Form**: Collects parent/student information, school details, and contact information
- **HeyGen Video Integration**: Generates personalized welcome videos
- **WhatsApp Messaging**: Sends videos and messages via WhatsApp API
- **Vercel KV Storage**: Stores form data and video URLs
- **Responsive Design**: Mobile-friendly form interface

## Form Steps

### Step 1: Basic Information
- Parent/Guardian Name
- Student Name  
- Student Age (dropdown: 2-10 years)

### Step 2: School Information
- Current Grade
- Current School
- Place of Study
- Student's Area of Interest

### Step 3: Contact Information
- WhatsApp Phone Number (demo numbers provided)
- Short Message

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Vercel KV
KV_REST_API_URL=your_vercel_kv_url
KV_REST_API_TOKEN=your_vercel_kv_token
KV_REST_API_READ_ONLY_TOKEN=your_vercel_kv_readonly_token

# HeyGen API
HEYGEN_API_KEY=your_heygen_api_key
HEYGEN_API_URL=https://api.heygen.com

# WhatsApp API
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id

# Demo phone numbers for testing
DEMO_PHONE_NUMBERS=919538055505,919876543210,919123456789
```

### 2. Vercel KV Setup

1. Go to your Vercel dashboard
2. Navigate to the Storage tab
3. Create a new KV database
4. Copy the connection details to your `.env.local` file

### 3. HeyGen API Setup

1. Sign up for HeyGen API access
2. Get your API key from the HeyGen dashboard
3. Add the API key to your environment variables

### 4. WhatsApp Business API Setup

1. Set up a WhatsApp Business account
2. Get your access token and phone number ID
3. Add these to your environment variables

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Development Server

```bash
npm run dev
```

## API Endpoints

### POST /api/submit-form
Handles form submission and initiates HeyGen video generation.

**Request Body:**
```json
{
  "step1": {
    "parentName": "John Doe",
    "studentName": "Jane Doe", 
    "studentAge": 8
  },
  "step2": {
    "currentGrade": "Grade 3",
    "currentSchool": "ABC School",
    "placeOfStudy": "Dubai",
    "areaOfInterest": "Science & Technology"
  },
  "step3": {
    "phoneNumber": "919538055505",
    "message": "Interested in admission"
  }
}
```

### POST /api/heygen-callback
Handles HeyGen video completion callbacks and sends WhatsApp messages.

**Request Body:**
```json
{
  "video_id": "video_123",
  "status": "completed",
  "video_url": "https://example.com/video.mp4"
}
```

## Workflow

1. **Form Submission**: User completes the 3-step form
2. **Data Storage**: Form data is saved to Vercel KV
3. **Video Generation**: HeyGen API is called with personalized script
4. **Callback Handling**: When video is ready, callback updates form status
5. **WhatsApp Delivery**: Video is sent to user's WhatsApp number

## Video Script Template

The generated video script follows this template:

```
Hello [Parent Name],
How are you? how is [Student First Name], we are excited to welcome [Student Name] to Fortes Education ecosystem. Your interactive session at Dubai school campus has been scheduled on [Next Day Date] at 10:30AM, Excited to meet [Student First Name].
```

## Demo Phone Numbers

The application includes demo phone numbers for testing:
- +91 95380 55505
- +91 98765 43210  
- +91 91234 56789

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Vercel KV**: Database storage
- **HeyGen API**: Video generation
- **WhatsApp Business API**: Messaging
- **Axios**: HTTP client

## Deployment

1. Deploy to Vercel
2. Set up environment variables in Vercel dashboard
3. Configure Vercel KV database
4. Set up HeyGen webhook URL: `https://your-domain.com/api/heygen-callback`

## Notes

- The form validates all required fields before submission
- Video generation may take a few minutes
- WhatsApp messages are sent automatically when videos are ready
- All form data is stored securely in Vercel KV
- The application is mobile-responsive and accessible