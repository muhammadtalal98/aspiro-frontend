# AI Career Path - Authentication Flow

This project implements a comprehensive authentication flow with CV upload and onboarding steps.

## Authentication Flow

### 1. User Registration/Login
- Users can register with email and password
- Form validation includes:
  - Required fields
  - Email format validation
  - Password minimum length (6 characters)
  - Password confirmation matching

### 2. CV Upload (Required Step)
- After successful login, users are redirected to CV upload
- File validation includes:
  - Supported formats: PDF, DOC, DOCX
  - Maximum file size: 10MB
  - Real-time upload progress simulation
  - AI analysis simulation with skills detection

### 3. Onboarding Questions (Required Step)
- Multi-step questionnaire with progress tracking
- Questions include:
  - Personal information (name)
  - Experience level
  - Current skills
  - Career goals
  - Educational background
- Form validation for required fields
- Smooth transitions between steps

### 4. Dashboard Access
- Only accessible after completing CV upload and onboarding
- Personalized welcome message
- Progress tracking
- AI assistant chat
- Career roadmap visualization

## Project Structure

```
├── app/
│   ├── login/page.tsx          # Login form with validation
│   ├── register/page.tsx       # Registration form with validation
│   ├── upload-cv/page.tsx      # CV upload with file validation
│   ├── onboarding/page.tsx     # Multi-step onboarding flow
│   ├── dashboard/page.tsx      # Main dashboard (protected)
│   └── page.tsx               # Landing page with auth redirects
├── components/
│   ├── protected-route.tsx     # Route protection logic
│   └── loading-spinner.tsx     # Reusable loading component
├── lib/
│   ├── auth-context.tsx        # Authentication context
│   └── validation.ts          # Form validation utilities
└── README.md                  # This file
```

## Key Features

### Authentication Context
- Manages user state across the application
- Handles login/logout functionality
- Tracks user progress (CV upload, onboarding completion)
- Persistent storage using localStorage

### Protected Routes
- Automatic redirects based on user progress
- Loading states during authentication checks
- Prevents access to incomplete flows

### Form Validation
- Real-time validation feedback
- Comprehensive error handling
- File upload validation
- Required field enforcement

### User Experience
- Smooth transitions between steps
- Progress indicators
- Loading states
- Error messaging
- Responsive design

## Getting Started

1. Install dependencies:
```bash
npm install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing the Flow

### Quick Test Mode
For immediate testing without registration, use these credentials:
- **Email**: `test@example.com`
- **Password**: `password123`

This will start you fresh in the flow and allow you to test all features.

### Regular Flow
1. **Register/Login**: Use any email and password (minimum 6 characters)
2. **CV Upload**: Upload any PDF, DOC, or DOCX file (under 10MB)
3. **Onboarding**: Complete the questionnaire
4. **Dashboard**: Access the main dashboard with personalized content

### Test Mode Features
- **Reset Progress**: Use the "Reset Progress" button on the dashboard to start over
- **Visual Indicators**: Test mode is clearly marked with yellow badges
- **Fresh Start**: Test user always starts with no CV uploaded and no onboarding completed

## Dummy Data

The application uses simulated data for:
- User authentication
- File upload progress
- CV analysis results
- AI recommendations
- Career roadmap steps

All data is stored in localStorage for demonstration purposes.

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Custom UI Components** - Glass morphism design
