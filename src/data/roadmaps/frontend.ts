import type { RoadmapData } from "./types";

const frontend: RoadmapData = {
  slug: "frontend",
  title: "Frontend Developer",
  description:
    "A path from web fundamentals to building production-grade, accessible, performant user interfaces.",
  group: "role",
  icon: "LayoutTemplate",
  nodes: [
    {
      id: "internet",
      title: "How the Internet Works",
      description: "Understand what happens between typing a URL and seeing a page render.",
      category: "core",
      children: [
        {
          id: "http",
          title: "HTTP & DNS",
          description: "How requests are routed and resolved.",
          category: "core",
          resources: [{ title: "MDN: An overview of HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" }],
        },
        {
          id: "hosting",
          title: "Hosting & Domains",
          description: "What a domain, DNS record, and static host actually do.",
          category: "optional",
        },
      ],
    },
    {
      id: "html-css",
      title: "HTML & CSS",
      description: "The structural and visual foundation of every web page.",
      category: "core",
      children: [
        {
          id: "semantic-html",
          title: "Semantic HTML",
          description: "Writing markup that's meaningful, not just visual.",
          category: "core",
          resources: [{ title: "MDN: HTML elements reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element" }],
        },
        {
          id: "css-layout",
          title: "Layout: Flexbox & Grid",
          description: "The two layout systems that power almost every modern UI.",
          category: "core",
          resources: [{ title: "CSS-Tricks: A Complete Guide to Flexbox", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" }],
        },
        {
          id: "responsive",
          title: "Responsive Design",
          description: "Media queries, fluid units, and mobile-first thinking.",
          category: "core",
        },
        {
          id: "css-preprocessors",
          title: "Sass & CSS Architecture",
          description: "Organizing styles at scale (BEM, utility-first, CSS Modules).",
          category: "optional",
        },
      ],
    },
    {
      id: "javascript",
      title: "JavaScript Fundamentals",
      description: "The language that makes pages interactive.",
      category: "core",
      children: [
        {
          id: "js-syntax",
          title: "Syntax & Data Types",
          description: "Variables, functions, arrays, objects, control flow.",
          category: "core",
        },
        {
          id: "js-dom",
          title: "DOM Manipulation",
          description: "Selecting, updating, and listening to events on the page.",
          category: "core",
        },
        {
          id: "js-async",
          title: "Async JS: Promises & async/await",
          description: "Handling network requests and other asynchronous work.",
          category: "core",
          resources: [{ title: "MDN: Asynchronous JavaScript", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous" }],
        },
        {
          id: "ts",
          title: "TypeScript",
          description: "Adding static types to catch bugs before runtime.",
          category: "optional",
          resources: [{ title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" }],
        },
      ],
    },
    {
      id: "version-control",
      title: "Git & GitHub",
      description: "Tracking changes and collaborating on code.",
      category: "core",
    },
    {
      id: "frameworks",
      title: "Pick a Framework",
      description: "Component-based UI libraries for building larger applications.",
      category: "core",
      children: [
        {
          id: "react",
          title: "React",
          description: "The most widely used component framework — start here.",
          category: "core",
          resources: [{ title: "React docs: Quick Start", url: "https://react.dev/learn" }],
        },
        {
          id: "nextjs",
          title: "Next.js",
          description: "React framework adding routing, SSR, and API routes.",
          category: "optional",
        },
        {
          id: "vue",
          title: "Vue (alternative path)",
          description: "A gentler learning curve, popular outside the React ecosystem.",
          category: "optional",
        },
      ],
    },
    {
      id: "state-mgmt",
      title: "State Management",
      description: "Handling data that's shared across components.",
      category: "core",
      children: [
        { id: "hooks-state", title: "Component State & Context", description: "Built-in React state tools.", category: "core" },
        { id: "external-state", title: "Zustand / Redux", description: "External stores for complex apps.", category: "optional" },
      ],
    },
    {
      id: "testing",
      title: "Testing",
      description: "Making sure your UI keeps working as it grows.",
      category: "optional",
      children: [
        { id: "unit-testing", title: "Unit Testing (Vitest/Jest)", description: "Testing individual functions and components.", category: "optional" },
        { id: "e2e-testing", title: "E2E Testing (Playwright)", description: "Testing full user flows in a real browser.", category: "optional" },
      ],
    },
    {
      id: "build-deploy",
      title: "Build Tools & Deployment",
      description: "Bundling your app and shipping it to the world.",
      category: "core",
      children: [
        { id: "bundlers", title: "Vite / Webpack", description: "How your code gets bundled for production.", category: "core" },
        { id: "deploy", title: "Deploying (Vercel/Netlify)", description: "Getting your app live.", category: "core" },
      ],
    },
    {
      id: "performance-a11y",
      title: "Performance & Accessibility",
      description: "Making your app fast and usable for everyone.",
      category: "optional",
      children: [
        { id: "perf", title: "Web Performance Basics", description: "Core Web Vitals, lazy loading, code splitting.", category: "optional" },
        { id: "a11y", title: "Web Accessibility (a11y)", description: "ARIA, keyboard navigation, screen readers.", category: "optional" },
      ],
    },
  ],
};

export default frontend;
