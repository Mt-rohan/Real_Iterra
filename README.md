# AI Tennis Coach

An AI-powered web application that analyzes your tennis form and provides personalized coaching feedback.

## Features

- Upload tennis videos (MP4 or MOV format)
- Analyze body movement using MediaPipe pose estimation
- Generate AI coaching feedback with OpenAI's GPT-4 Turbo
- Display feedback with your video for review

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Video Analysis**: MediaPipe, TensorFlow.js
- **AI Integration**: OpenAI API (GPT-4 Turbo)
- **Storage**: Firebase Storage
- **Database**: Firebase Firestore (for future enhancements)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ai-tennis-coach.git
   cd ai-tennis-coach
