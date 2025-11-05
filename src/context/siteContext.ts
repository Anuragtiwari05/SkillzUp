// src/context/siteContext.ts

export const siteContext = {
  name: "SkillzUp",
  tagline: "Your personalized learning companion powered by AI.",
  description:
    "SkillzUp is a smart learning platform that helps users discover, plan, and track their learning journey using AI. It brings together top educational resources from platforms like Udemy, YouTube, Coursera, and Medium — all in one place.",

  features: [
    {
      name: "Courses from the Web",
      description:
        "Aggregates curated courses and tutorials from trusted sources like Udemy, YouTube, Coursera, and Medium, helping users find the best content quickly.",
    },
    {
      name: "AI Learning Assistant",
      description:
        "An intelligent chatbot that guides users in exploring SkillzUp, suggests courses, creates study plans, and answers learning-related questions.",
    },
    {
      name: "Dashboard",
      description:
        "A personalized space where users can track progress, view saved courses, bookmarks, and recent learning activities.",
    },
    {
      name: "Authentication",
      description:
        "Secure signup and login system using dynamic cookie sessions to personalize the user experience.",
    },
    {
      name: "Payment Integration",
      description:
        "Supports Stripe or Razorpay for seamless course or plan purchases (optional feature for premium content).",
    },
  ],

  upcomingFeatures: [
    "AI-based study roadmap generator",
    "Bookmarking and saving favorite resources",
    "Personalized notifications and activity tracking",
    "AI-driven performance analysis",
  ],

  toneAndPersonality: {
    style:
      "Friendly, supportive, and motivating — speaks like a mentor helping students achieve their learning goals.",
    avoid:
      "Avoid giving irrelevant answers, medical advice, or personal opinions. Always keep replies related to SkillzUp, learning, or productivity.",
  },

  quickActions: [
    "Plan my study routine",
    "Find a course for Machine Learning",
    "Show SkillzUp features",
    "How does SkillzUp work?",
    "What can I do in the dashboard?",
  ],

  mission:
    "To simplify online learning by unifying multiple platforms and empowering students with AI-driven study support.",
};
