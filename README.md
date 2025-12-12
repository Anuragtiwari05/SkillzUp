🌟 SkillzUp — AI-Powered Personalized Learning Platform
🔗 Live Application:

https://skillz-up.vercel.app/

SkillzUp is a modern AI-driven learning platform designed to help users discover the right skills, generate personalized learning roadmaps, explore curated resources from the web, and interact with a built-in AI assistant. It also includes subscription management, platform integrations, and workflow automation using n8n — all built with a clean, scalable architecture.

🚀 Core Features
🧠 AI Learning Assistant

Built using Gemini 1.5 Flash

Interactive chat system with:

Persistent chat sessions

Sidebar chat history

Delete & manage conversations

Generates:

Learning paths

Skill roadmaps

Course recommendations

Explanations & guidance

🎓 Courses From the Web

Centralized access to high-quality resources from multiple platforms:

Udemy

Coursera

LinkedIn Learning

YouTube

Medium

Google Classroom

And more…

The user receives curated learning material for any topic directly inside SkillzUp.

🤖 n8n Workflow Automation

Background data processing

Search aggregation

HTTP integrations

Automations for scalability

Connected to SkillzUp via secured webhooks

💳 Razorpay Subscription System

Subscription plan creation

Order generation

Payment verification

Success & failure pages

Full test mode integration

Secure API routes for backend validation

🔐 Authentication & User System

Login / Signup

Secure session handling (cookies)

Protected dashboard

User-specific content

Logout & session management

📊 Personalized Dashboard

Shows generated roadmaps

Saved courses & learning progress

Access to external learning platforms

Quick access to chatbot and tools

Platform link cards (LinkedIn, GitHub, YouTube, ChatGPT, etc.)

🖥️ Modern & Clean UI

Built with Next.js App Router

Fully responsive

Component-driven architecture

Smooth animations

Floating chat button

Professional layout and spacing

🛠️ Tech Stack
Layer	Technologies
Frontend	Next.js (App Directory), React, Tailwind CSS
AI	Gemini API
Automation	n8n
Payments	Razorpay
Backend	Next.js API Routes
Database	MongoDB + Mongoose Models
Deployment	Vercel
Version Control	GitHub
📦 Project Structure (High-Level)
src/
│
├── app/
│   ├── api/
│   ├── chat/
│   ├── dashboard/
│   ├── features/
│   └── page.tsx
│
├── components/
│   ├── Subscription.tsx
│   ├── FloatingChatButton.tsx
│   └── UI elements...
│
├── models/
│   ├── User.ts
│   └── Subscription.ts
│
├── utils/
├── context/
└── public/

🔧 Environment Variables

Create .env.local and add:

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

GEMINI_API_KEY=

N8N_WEBHOOK_URL=

MONGODB_URI=
NEXTAUTH_SECRET=

🏗️ Installation & Setup
git clone <repository-url>
cd skillzup
npm install
npm run dev

🚀 Deployment (Vercel)

Push to GitHub

Import repository into Vercel

Add all environment variables

Deploy instantly

🎯 Why SkillzUp?

SkillzUp focuses on solving the most common learning challenges:

“What should I learn next?”

“Which course is worth taking?”

“How do I build a roadmap?”

“What’s the best resource for this topic?”

With AI assistance, curated course aggregation, subscriptions, and a modern interface — SkillzUp becomes a complete personalized learning ecosystem.

🌐 Live Demo
👉 https://skillz-8xhsvga25-anurags-projects-8619b329.vercel.app
