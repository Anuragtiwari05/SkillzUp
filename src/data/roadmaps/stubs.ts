import type { RoadmapData, RoadmapNode } from "./types";

// Shorter than Frontend/Python/System Design, but every top-level topic here
// now has real explanatory depth (2+ sentences), 2-3 concrete subtopics, and
// resource links — not one-line placeholders. Content is originally written
// from general domain knowledge, not scraped from any external roadmap site.

const stubs: RoadmapData[] = [
  {
    slug: "backend",
    title: "Backend Developer",
    description: "Server-side logic, APIs, databases, and the infrastructure that powers applications.",
    group: "role",
    icon: "Server",
    nodes: [
      {
        id: "internet",
        title: "Internet & HTTP Basics",
        description:
          "Before writing server code, understand what actually happens when a client talks to a server: DNS resolution, TCP connections, and the request/response cycle. This context makes debugging real issues (timeouts, CORS errors, wrong status codes) far easier later.",
        category: "core",
        children: [
          {
            id: "http-methods",
            title: "HTTP Methods & Status Codes",
            description: "GET/POST/PUT/DELETE semantics and what 2xx/4xx/5xx codes actually mean.",
            category: "core",
            resources: [{ title: "MDN: HTTP request methods", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods" }],
          },
          {
            id: "dns-tls",
            title: "DNS & TLS",
            description: "How a domain resolves to a server, and how HTTPS encrypts traffic in transit.",
            category: "optional",
          },
        ],
      },
      {
        id: "language",
        title: "Pick a Backend Language",
        description:
          "Node.js, Python, Java, and Go are all valid starting points — the concepts (routing, middleware, request handling) transfer between them. Pick one based on what job market or ecosystem you're targeting, and go deep rather than sampling all of them shallowly.",
        category: "core",
        children: [
          { id: "syntax-basics", title: "Core Language Syntax", description: "Variables, functions, error handling, and async patterns in your chosen language.", category: "core" },
          { id: "package-manager", title: "Package Manager", description: "npm/pip/Maven — installing and managing third-party dependencies.", category: "core" },
        ],
      },
      {
        id: "databases",
        title: "Databases",
        description:
          "Almost every backend needs to persist data. Learn one relational database (Postgres or MySQL) deeply for structured data with relationships, and understand when a document store like MongoDB is a better fit for flexible, nested data.",
        category: "core",
        children: [
          { id: "sql-crud", title: "SQL Fundamentals", description: "SELECT, INSERT, UPDATE, DELETE, and JOINs across tables.", category: "core", resources: [{ title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/" }] },
          { id: "orm", title: "Using an ORM", description: "Prisma, SQLAlchemy, or similar — mapping database rows to code objects.", category: "optional" },
          { id: "nosql-basics", title: "NoSQL Basics", description: "When a document/key-value store fits better than a relational schema.", category: "optional" },
        ],
      },
      {
        id: "apis",
        title: "Building APIs",
        description:
          "Design endpoints that are predictable and consistent — REST is the default choice for most projects, while GraphQL is worth learning once you've felt REST's pain points (over-fetching, versioning). Validate every input; never trust the client.",
        category: "core",
        children: [
          { id: "rest-design", title: "RESTful API Design", description: "Resource naming, status codes, pagination, and versioning conventions.", category: "core" },
          { id: "validation", title: "Request Validation", description: "Rejecting malformed input before it reaches your business logic.", category: "core" },
          { id: "graphql-basics", title: "GraphQL Basics", description: "An alternative query-based API style worth knowing once REST feels limiting.", category: "optional" },
        ],
      },
      {
        id: "auth",
        title: "Authentication & Authorization",
        description:
          "Authentication answers 'who is this user'; authorization answers 'what are they allowed to do.' Get comfortable with hashed passwords, JWTs or sessions, and never rolling your own crypto.",
        category: "core",
        children: [
          { id: "sessions-jwt", title: "Sessions vs JWTs", description: "Two common ways to keep a user logged in across requests, and their tradeoffs.", category: "core" },
          { id: "oauth", title: "OAuth / Social Login", description: "Letting users sign in with Google/GitHub instead of a new password.", category: "optional" },
        ],
      },
      {
        id: "deployment",
        title: "Deployment & Scaling",
        description:
          "Getting an API running reliably in production involves more than 'it works on my machine' — logging, environment variables, and graceful error handling all matter once real users depend on it.",
        category: "optional",
        children: [
          { id: "env-config", title: "Environment Config & Secrets", description: "Keeping API keys and credentials out of source control.", category: "core" },
          { id: "hosting-backend", title: "Hosting a Backend", description: "Railway, Render, or a VPS — getting your API reachable on the internet.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "full-stack",
    title: "Full Stack Developer",
    description: "Combining frontend and backend skills to build complete applications end to end.",
    group: "role",
    icon: "Layers",
    nodes: [
      {
        id: "frontend-basics",
        title: "Frontend Basics",
        description:
          "You need enough frontend fluency to build a real interface, not just consume an API: HTML/CSS fundamentals, JavaScript, and a component framework like React. This is the layer users actually see and interact with.",
        category: "core",
        children: [
          { id: "html-css-fs", title: "HTML & CSS", description: "Structuring content and styling layout with Flexbox/Grid.", category: "core" },
          { id: "react-fs", title: "React Fundamentals", description: "Components, state, and props — the building blocks of most modern UIs.", category: "core", resources: [{ title: "React docs: Quick Start", url: "https://react.dev/learn" }] },
        ],
      },
      {
        id: "backend-basics",
        title: "Backend Basics",
        description:
          "On the other end, you need a server language, a way to expose REST APIs, and a database to persist data. The goal isn't backend mastery yet — it's enough to build and connect a working API.",
        category: "core",
        children: [
          { id: "node-express-fs", title: "Node.js & Express (or similar)", description: "The most common pairing for a JS-based full stack, but any backend language works.", category: "core" },
          { id: "database-fs", title: "A Database", description: "Postgres or MongoDB — pick one and learn its basic CRUD operations well.", category: "core" },
        ],
      },
      {
        id: "fullstack-framework",
        title: "Full Stack Framework",
        description:
          "Frameworks like Next.js let you write frontend and backend code in one project, sharing types and reducing the seams between the two layers — a big productivity boost once you understand both sides independently.",
        category: "core",
        children: [
          { id: "nextjs-fs", title: "Next.js App Router", description: "File-based routing, server components, and API routes in one framework.", category: "core", resources: [{ title: "Next.js Documentation", url: "https://nextjs.org/docs" }] },
          { id: "data-fetching-fs", title: "Data Fetching Patterns", description: "Server-side fetching vs client-side fetching, and when to use each.", category: "optional" },
        ],
      },
      {
        id: "auth-fs",
        title: "Auth & Sessions End to End",
        description:
          "Wiring up login/signup across both layers — issuing a token or session on the backend, and correctly attaching/reading it on the frontend — is a genuinely tricky full-stack skill worth practicing deliberately.",
        category: "core",
        children: [
          { id: "cookies-fs", title: "Cookies & Tokens", description: "How the frontend and backend actually pass auth state back and forth.", category: "core" },
          { id: "protected-routes-fs", title: "Protected Routes", description: "Redirecting unauthenticated users, both client- and server-side.", category: "optional" },
        ],
      },
      {
        id: "deploy-fs",
        title: "Deployment",
        description:
          "Shipping a full stack app means deploying both halves (or one combined deployment for frameworks like Next.js) and managing environment variables/secrets correctly across environments.",
        category: "optional",
        children: [
          { id: "vercel-fs", title: "Deploying to Vercel/Netlify", description: "The fastest path to a live URL for most full stack JS frameworks.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "devops",
    title: "DevOps Engineer",
    description: "Automating build, test, and deployment pipelines, and keeping systems running reliably.",
    group: "role",
    icon: "Workflow",
    nodes: [
      {
        id: "linux",
        title: "Linux & Shell Scripting",
        description:
          "Almost all production infrastructure runs on Linux. Comfort with the command line — navigating the filesystem, managing processes, reading logs, and writing basic shell scripts — is foundational to everything else in DevOps.",
        category: "core",
        children: [
          { id: "linux-basics", title: "Core Linux Commands", description: "File permissions, process management, piping, and grep/awk/sed basics.", category: "core" },
          { id: "bash-scripting", title: "Bash Scripting", description: "Automating repetitive tasks with simple scripts.", category: "core" },
        ],
      },
      {
        id: "cicd",
        title: "CI/CD Pipelines",
        description:
          "Continuous Integration and Continuous Deployment automate building, testing, and shipping code on every change, catching problems early and removing manual deploy steps that are easy to get wrong.",
        category: "core",
        children: [
          { id: "github-actions", title: "GitHub Actions", description: "Defining pipelines as YAML that run tests and deployments automatically.", category: "core", resources: [{ title: "GitHub Actions Documentation", url: "https://docs.github.com/en/actions" }] },
          { id: "pipeline-stages", title: "Build/Test/Deploy Stages", description: "Structuring a pipeline so failures are caught before production.", category: "optional" },
        ],
      },
      {
        id: "containers",
        title: "Containers",
        description:
          "Docker packages an application with everything it needs to run, so it behaves the same on your laptop, in CI, and in production — eliminating a huge class of 'works on my machine' bugs.",
        category: "core",
        children: [
          { id: "docker-fundamentals", title: "Docker Fundamentals", description: "Images, containers, and writing a Dockerfile.", category: "core", resources: [{ title: "Docker Get Started Guide", url: "https://docs.docker.com/get-started/" }] },
          { id: "docker-compose-devops", title: "Docker Compose", description: "Running multi-container setups (app + database) locally.", category: "optional" },
        ],
      },
      {
        id: "orchestration",
        title: "Orchestration",
        description:
          "Once you're running many containers across many machines, Kubernetes automates scheduling, scaling, and self-healing — restarting failed containers and distributing load without manual intervention.",
        category: "optional",
        children: [
          { id: "k8s-core-devops", title: "Kubernetes Core Concepts", description: "Pods, Deployments, and Services as the basic building blocks.", category: "optional" },
        ],
      },
      {
        id: "iac",
        title: "Infrastructure as Code",
        description:
          "Instead of clicking through a cloud console, tools like Terraform let you define your infrastructure in version-controlled files — making changes reviewable, repeatable, and reversible.",
        category: "optional",
        children: [
          { id: "terraform-basics", title: "Terraform Basics", description: "Declaring cloud resources (servers, networks) as code.", category: "optional" },
        ],
      },
      {
        id: "monitoring-alerting",
        title: "Monitoring & Alerting",
        description:
          "You can't fix what you can't see. Setting up dashboards and alerts means you find out about an outage from your monitoring tool, not from an angry user.",
        category: "core",
        children: [
          { id: "logging-devops", title: "Centralized Logging", description: "Aggregating logs from many services into one searchable place.", category: "core" },
          { id: "alerting-devops", title: "Alerting Thresholds", description: "Getting paged for real problems without alert fatigue from noise.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "data-analyst",
    title: "Data Analyst",
    description: "Turning raw data into insights through querying, analysis, and visualization.",
    group: "role",
    icon: "BarChart3",
    nodes: [
      {
        id: "excel",
        title: "Spreadsheets",
        description:
          "Before touching code, spreadsheets are still where a huge amount of real analysis happens. Pivot tables, VLOOKUP/XLOOKUP, and conditional formatting cover a surprising number of business questions quickly.",
        category: "core",
        children: [
          { id: "pivot-tables", title: "Pivot Tables", description: "Summarizing large datasets into digestible tables without writing formulas.", category: "core" },
          { id: "excel-formulas", title: "Lookup & Aggregation Formulas", description: "VLOOKUP/XLOOKUP, SUMIF, COUNTIF for combining and summarizing data.", category: "optional" },
        ],
      },
      {
        id: "sql-da",
        title: "SQL",
        description:
          "SQL is the single most important skill for a data analyst — it's how you pull exactly the data you need out of a company's database instead of waiting for someone else to export it for you.",
        category: "core",
        children: [
          { id: "sql-joins-da", title: "Joins & Filtering", description: "Combining data across multiple tables accurately.", category: "core", resources: [{ title: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/" }] },
          { id: "sql-window-fns", title: "Window Functions", description: "Running totals, rankings, and period-over-period comparisons.", category: "optional" },
        ],
      },
      {
        id: "python-da",
        title: "Python for Analysis",
        description:
          "pandas turns spreadsheet-style operations (filtering, grouping, merging) into reusable, scriptable code — essential once your analysis needs to run repeatedly or handle data too large for Excel comfortably.",
        category: "core",
        children: [
          { id: "pandas-basics", title: "pandas Basics", description: "DataFrames, filtering, and groupby operations.", category: "core", resources: [{ title: "pandas Getting Started", url: "https://pandas.pydata.org/docs/getting_started/index.html" }] },
          { id: "numpy-basics", title: "NumPy Basics", description: "Fast numerical operations underlying most Python data tools.", category: "optional" },
        ],
      },
      {
        id: "stats-da",
        title: "Statistics Basics",
        description:
          "Understanding distributions, correlation vs causation, and basic hypothesis testing keeps you from drawing confident-sounding but wrong conclusions from noisy data.",
        category: "core",
        children: [
          { id: "descriptive-stats", title: "Descriptive Statistics", description: "Mean, median, standard deviation, and what they actually tell you.", category: "core" },
          { id: "hypothesis-testing", title: "Hypothesis Testing", description: "A/B test fundamentals and statistical significance.", category: "optional" },
        ],
      },
      {
        id: "viz",
        title: "Data Visualization",
        description:
          "A correct analysis that nobody understands is wasted. Learn to choose the right chart for the question and to strip out chart junk that obscures the signal.",
        category: "core",
        children: [
          { id: "chart-choice", title: "Choosing the Right Chart", description: "When to use a bar chart vs a line chart vs a scatter plot.", category: "core" },
          { id: "bi-tools", title: "BI Tools", description: "Power BI or Tableau for building shareable, interactive dashboards.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "ai-engineer",
    title: "AI Engineer",
    description: "Building applications powered by large language models and other AI systems.",
    group: "role",
    icon: "Bot",
    nodes: [
      {
        id: "python-ai",
        title: "Python",
        description:
          "Python is the near-universal language of the AI ecosystem — nearly every model API, SDK, and research library ships Python bindings first.",
        category: "core",
        children: [
          { id: "python-basics-ai", title: "Python Fundamentals", description: "Comfortable enough with functions, data structures, and error handling to build small tools quickly.", category: "core" },
        ],
      },
      {
        id: "llm-basics",
        title: "LLM Fundamentals",
        description:
          "You don't need to train a model from scratch to build with LLMs, but understanding tokens, context windows, and why models hallucinate helps you design around their real limitations instead of being surprised by them.",
        category: "core",
        children: [
          { id: "tokens-context", title: "Tokens & Context Windows", description: "Why longer conversations cost more and eventually get truncated.", category: "core" },
          { id: "hallucination", title: "Why Models Hallucinate", description: "Understanding this shapes when you can trust raw output vs when you need grounding.", category: "optional" },
        ],
      },
      {
        id: "prompting",
        title: "Prompt Engineering",
        description:
          "Small changes in how you phrase a prompt — giving examples, specifying output format, breaking a task into steps — often matter more for reliability than which model you use.",
        category: "core",
        children: [
          { id: "few-shot", title: "Few-Shot Prompting", description: "Showing the model 1-2 examples of the desired output format.", category: "core" },
          { id: "structured-output", title: "Structured Output (JSON mode)", description: "Getting the model to reliably return parseable data instead of free text.", category: "core" },
        ],
      },
      {
        id: "rag",
        title: "Retrieval-Augmented Generation",
        description:
          "RAG grounds a model's answers in your own documents by retrieving relevant text and feeding it into the prompt — the standard technique for building a chatbot that knows about content the model was never trained on.",
        category: "core",
        children: [
          { id: "embeddings", title: "Embeddings & Vector Search", description: "Turning text into vectors so you can find semantically similar content.", category: "core" },
          { id: "vector-db", title: "Vector Databases", description: "Pinecone, Weaviate, or pgvector for storing and querying embeddings at scale.", category: "optional" },
        ],
      },
      {
        id: "apis-ai",
        title: "Working with Model APIs",
        description:
          "Every major provider (OpenAI, Anthropic, Google) has an SDK with slightly different conventions for messages, streaming, and tool/function calling — learning one deeply makes the others easy to pick up.",
        category: "core",
        children: [
          { id: "tool-calling", title: "Tool / Function Calling", description: "Letting the model call your own functions to fetch data or take actions.", category: "core" },
        ],
      },
      {
        id: "evaluation",
        title: "Evaluation & Guardrails",
        description:
          "Before shipping, you need a way to measure whether outputs are actually good, and guardrails to constrain what the model is allowed to say or do in production.",
        category: "optional",
        children: [
          { id: "eval-basics", title: "Building an Eval Set", description: "A repeatable set of test prompts to catch regressions when you change a prompt.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "data-engineer",
    title: "Data Engineer",
    description: "Building the pipelines that move and transform data reliably at scale.",
    group: "role",
    icon: "Database",
    nodes: [
      {
        id: "sql-de",
        title: "Advanced SQL",
        description:
          "Data engineers write SQL that has to run efficiently over huge tables — window functions, query optimization, and understanding execution plans matter far more here than in typical application code.",
        category: "core",
        children: [
          { id: "query-optimization", title: "Query Optimization", description: "Reading an execution plan and knowing when an index will actually help.", category: "core" },
          { id: "window-fns-de", title: "Window Functions", description: "Ranking, running totals, and lead/lag across partitions of data.", category: "optional" },
        ],
      },
      {
        id: "python-de",
        title: "Python for Data Engineering",
        description:
          "Python glues together most data pipelines — scripting extraction from APIs/files, transforming records, and loading them into a destination system.",
        category: "core",
        children: [
          { id: "etl-scripting", title: "Scripting ETL Jobs", description: "Reading from a source, transforming records, writing to a destination — the core loop.", category: "core" },
        ],
      },
      {
        id: "etl",
        title: "ETL/ELT Pipelines",
        description:
          "Extract-Transform-Load (or Extract-Load-Transform, doing the heavy transformation inside the warehouse) is the fundamental pattern data engineers build over and over, just with different tools and scale.",
        category: "core",
        children: [
          { id: "batch-vs-streaming", title: "Batch vs Streaming", description: "Running on a schedule vs processing data as it arrives.", category: "core" },
          { id: "idempotency", title: "Idempotent Pipelines", description: "Designing jobs so re-running them after a failure doesn't duplicate data.", category: "optional" },
        ],
      },
      {
        id: "warehouses",
        title: "Data Warehouses",
        description:
          "Warehouses like BigQuery and Snowflake are built for large analytical queries across huge tables, unlike a normal application database optimized for many small transactions.",
        category: "core",
        children: [
          { id: "warehouse-modeling", title: "Dimensional Modeling", description: "Fact and dimension tables — the standard way warehouses are structured for analytics.", category: "optional" },
        ],
      },
      {
        id: "orchestration-de",
        title: "Pipeline Orchestration",
        description:
          "Once you have more than a couple of pipelines, you need a scheduler that understands dependencies between jobs, retries failures, and gives visibility into what ran and what didn't — that's what tools like Airflow are for.",
        category: "optional",
        children: [
          { id: "airflow-basics", title: "Airflow Basics", description: "DAGs, tasks, and scheduling dependent jobs.", category: "optional" },
        ],
      },
      {
        id: "streaming",
        title: "Streaming Data",
        description:
          "Some use cases can't wait for a nightly batch job — Kafka and similar tools let you process events as they happen, which is its own discipline with different failure modes than batch processing.",
        category: "optional",
        children: [
          { id: "kafka-basics", title: "Kafka Fundamentals", description: "Topics, producers, and consumers as the building blocks of event streaming.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "machine-learning",
    title: "Machine Learning",
    description: "Foundations of building and evaluating models that learn from data.",
    group: "role",
    icon: "Brain",
    nodes: [
      {
        id: "math-ml",
        title: "Math Foundations",
        description:
          "You don't need a PhD's worth of math to get started, but linear algebra (vectors, matrices), basic calculus (gradients), and probability give you the intuition for why algorithms behave the way they do.",
        category: "core",
        children: [
          { id: "linear-algebra-ml", title: "Linear Algebra Essentials", description: "Vectors, matrices, and dot products — the language most ML algorithms are written in.", category: "core" },
          { id: "probability-ml", title: "Probability Basics", description: "Distributions and conditional probability, used constantly in ML reasoning.", category: "optional" },
        ],
      },
      {
        id: "python-ml",
        title: "Python & NumPy/pandas",
        description:
          "The entire Python ML ecosystem (scikit-learn, PyTorch, TensorFlow) is built on NumPy arrays and pandas DataFrames for data manipulation — comfort here is a prerequisite for everything after.",
        category: "core",
        children: [
          { id: "numpy-ml", title: "NumPy Arrays", description: "Vectorized operations that make numerical code fast.", category: "core" },
        ],
      },
      {
        id: "classic-ml",
        title: "Classical ML",
        description:
          "Regression, classification, and clustering with scikit-learn will solve a large fraction of real-world problems without needing deep learning at all — and they're much faster to train and easier to interpret.",
        category: "core",
        children: [
          { id: "regression-classification", title: "Regression & Classification", description: "Predicting a number vs predicting a category — the two most common supervised tasks.", category: "core", resources: [{ title: "scikit-learn User Guide", url: "https://scikit-learn.org/stable/user_guide.html" }] },
          { id: "clustering", title: "Clustering", description: "Finding groups in unlabeled data (k-means and similar).", category: "optional" },
        ],
      },
      {
        id: "deep-learning",
        title: "Deep Learning Basics",
        description:
          "Neural networks shine on unstructured data (images, text, audio) where classical ML struggles. Learn the fundamentals with PyTorch or TensorFlow before jumping into any specific architecture.",
        category: "core",
        children: [
          { id: "neural-nets-basics", title: "Neural Network Fundamentals", description: "Layers, activations, and backpropagation at a conceptual level.", category: "core" },
          { id: "pytorch-basics", title: "PyTorch Basics", description: "Tensors, autograd, and training a simple model end to end.", category: "optional" },
        ],
      },
      {
        id: "model-eval",
        title: "Model Evaluation",
        description:
          "A model that scores 99% accuracy can still be useless if the data is imbalanced — understanding precision/recall, overfitting, and cross-validation prevents you from fooling yourself with misleading metrics.",
        category: "core",
        children: [
          { id: "overfitting", title: "Overfitting & Regularization", description: "Why a model that's 'too good' on training data often fails in production.", category: "core" },
          { id: "cross-validation", title: "Cross-Validation", description: "Getting a reliable estimate of how a model will perform on new data.", category: "optional" },
        ],
      },
      {
        id: "deployment-ml",
        title: "Deploying Models",
        description:
          "A model sitting in a notebook delivers no value — serving predictions via an API, monitoring for data drift, and retraining on a schedule are what turn a model into a real product feature.",
        category: "optional",
        children: [
          { id: "model-serving", title: "Model Serving Basics", description: "Wrapping a trained model behind a simple prediction API.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "ux-design",
    title: "UX Design",
    description: "Designing usable, accessible, and delightful digital experiences.",
    group: "role",
    icon: "PenTool",
    nodes: [
      {
        id: "design-thinking",
        title: "Design Thinking",
        description:
          "The empathize-define-ideate-prototype-test cycle keeps you designing for real user problems instead of jumping straight to visuals based on assumptions.",
        category: "core",
        children: [
          { id: "problem-framing", title: "Problem Framing", description: "Turning a vague complaint into a clear, testable problem statement.", category: "core" },
        ],
      },
      {
        id: "research",
        title: "User Research",
        description:
          "Talking to real users before and during design catches wrong assumptions early, when they're cheap to fix — far cheaper than discovering them after launch.",
        category: "core",
        children: [
          { id: "interviews-ux", title: "User Interviews", description: "Asking open-ended questions without leading the user toward an answer.", category: "core" },
          { id: "usability-testing", title: "Usability Testing", description: "Watching real users attempt tasks in your prototype to find friction points.", category: "optional" },
        ],
      },
      {
        id: "wireframing",
        title: "Wireframing & Prototyping",
        description:
          "Low-fidelity wireframes let you iterate on layout and flow fast before investing in visual polish. Figma is the industry-standard tool for both wireframes and interactive prototypes.",
        category: "core",
        children: [
          { id: "figma-basics", title: "Figma Fundamentals", description: "Frames, components, and auto-layout for building reusable UI pieces.", category: "core", resources: [{ title: "Figma Learn", url: "https://help.figma.com/hc/en-us" }] },
        ],
      },
      {
        id: "visual-design",
        title: "Visual Design Principles",
        description:
          "Typography, color, spacing, and visual hierarchy determine whether an interface feels polished or amateurish — these are learnable skills, not just innate taste.",
        category: "core",
        children: [
          { id: "typography-ux", title: "Typography Basics", description: "Font pairing, sizing scales, and line height for readability.", category: "core" },
          { id: "color-theory", title: "Color & Contrast", description: "Building an accessible, cohesive color palette.", category: "optional" },
        ],
      },
      {
        id: "a11y-ux",
        title: "Accessibility",
        description:
          "Designing for keyboard navigation, screen readers, and sufficient color contrast isn't optional polish — it determines whether a meaningful fraction of users can use your product at all.",
        category: "core",
        children: [
          { id: "wcag-basics", title: "WCAG Basics", description: "The standard accessibility guidelines most products are measured against.", category: "core" },
        ],
      },
      {
        id: "handoff",
        title: "Design Systems & Handoff",
        description:
          "A shared design system (consistent components, spacing, and tokens) keeps a growing product visually consistent and makes engineering handoff far smoother.",
        category: "optional",
        children: [
          { id: "component-libraries", title: "Component Libraries", description: "Reusable design components that map cleanly to code components.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "qa",
    title: "QA Engineer",
    description: "Ensuring software quality through manual and automated testing.",
    group: "role",
    icon: "Bug",
    nodes: [
      {
        id: "testing-fundamentals",
        title: "Testing Fundamentals",
        description:
          "Good QA starts with writing clear test cases and bug reports — a bug report that doesn't reliably reproduce the issue wastes everyone's time.",
        category: "core",
        children: [
          { id: "test-case-design", title: "Test Case Design", description: "Covering happy paths, edge cases, and error states deliberately, not just by accident.", category: "core" },
          { id: "bug-reports", title: "Writing Good Bug Reports", description: "Steps to reproduce, expected vs actual behavior, environment details.", category: "core" },
        ],
      },
      {
        id: "manual-qa",
        title: "Manual Testing",
        description:
          "Exploratory testing — poking at an app without a rigid script — often finds bugs that scripted tests miss, especially around unusual user behavior.",
        category: "core",
        children: [
          { id: "exploratory-testing", title: "Exploratory Testing", description: "Using intuition and experience to hunt for bugs outside the obvious paths.", category: "optional" },
        ],
      },
      {
        id: "automation-qa",
        title: "Test Automation",
        description:
          "Automated UI tests (Playwright, Cypress) catch regressions on every code change without manual re-testing — essential once an app is too big to fully re-test by hand each release.",
        category: "core",
        children: [
          { id: "playwright-basics", title: "Playwright/Cypress Basics", description: "Writing a script that drives a real browser to verify a user flow.", category: "core", resources: [{ title: "Playwright Documentation", url: "https://playwright.dev/docs/intro" }] },
          { id: "test-stability", title: "Writing Stable Tests", description: "Avoiding flaky tests that fail intermittently for no real reason.", category: "optional" },
        ],
      },
      {
        id: "api-testing",
        title: "API Testing",
        description:
          "Testing directly against an API (with Postman or code) is faster and more reliable than always going through the UI, and it's how you verify backend contracts independently of frontend bugs.",
        category: "core",
        children: [
          { id: "postman-basics", title: "Postman Basics", description: "Sending requests and asserting on responses without writing code.", category: "core" },
        ],
      },
      {
        id: "cicd-qa",
        title: "QA in CI/CD",
        description:
          "Running your automated test suite on every pull request catches regressions before they reach production, turning testing from a manual gate into a fast, automatic one.",
        category: "optional",
        children: [
          { id: "test-in-pipeline", title: "Running Tests in a Pipeline", description: "Wiring your test suite into GitHub Actions or similar so it runs automatically.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "software-architect",
    title: "Software Architect",
    description: "Designing the high-level structure of software systems and guiding technical decisions.",
    group: "role",
    icon: "Building2",
    nodes: [
      {
        id: "design-patterns",
        title: "Design Patterns",
        description:
          "Patterns like Factory, Observer, and Strategy are reusable solutions to recurring design problems — knowing them gives you a shared vocabulary with other engineers, not just abstract theory.",
        category: "core",
        children: [
          { id: "creational-patterns", title: "Creational Patterns", description: "Factory and Builder patterns for controlling how objects get created.", category: "optional" },
          { id: "behavioral-patterns", title: "Behavioral Patterns", description: "Observer and Strategy patterns for flexible communication between objects.", category: "optional" },
        ],
      },
      {
        id: "architecture-patterns",
        title: "Architecture Patterns",
        description:
          "Layered architecture, event-driven systems, and microservices each solve different problems — the skill is picking the simplest one that fits your actual scale and team size, not defaulting to the trendiest.",
        category: "core",
        children: [
          { id: "layered-arch", title: "Layered Architecture", description: "Separating presentation, business logic, and data access cleanly.", category: "core" },
          { id: "event-driven", title: "Event-Driven Architecture", description: "Decoupling services through events instead of direct calls.", category: "optional" },
        ],
      },
      {
        id: "system-design-arch",
        title: "System Design Fundamentals",
        description:
          "Scaling, caching, and database trade-offs are core architect skills — see the dedicated System Design roadmap on this site for a full, structured treatment of this topic.",
        category: "core",
      },
      {
        id: "tradeoffs",
        title: "Trade-off Analysis",
        description:
          "Every architectural decision trades something for something else — consistency for availability, simplicity for flexibility, cost for performance. An architect's job is making those trade-offs explicit and deliberate.",
        category: "core",
        children: [
          { id: "buy-vs-build", title: "Build vs Buy", description: "When to use a managed service instead of building it yourself.", category: "optional" },
        ],
      },
      {
        id: "documentation",
        title: "Technical Documentation",
        description:
          "Architecture Decision Records (ADRs) capture why a decision was made, not just what was decided — invaluable when someone questions the choice a year later.",
        category: "optional",
        children: [
          { id: "adrs", title: "Writing ADRs", description: "A lightweight format for recording significant technical decisions and their context.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "cyber-security",
    title: "Cyber Security",
    description: "Protecting systems and data from threats through defensive and offensive security practices.",
    group: "role",
    icon: "ShieldCheck",
    nodes: [
      {
        id: "networking-sec",
        title: "Networking Fundamentals",
        description:
          "Security is built on top of networking — you can't secure what you don't understand. TCP/IP, firewalls, and VPNs are the foundation for reasoning about how attacks actually travel across a network.",
        category: "core",
        children: [
          { id: "tcp-ip-sec", title: "TCP/IP Basics", description: "How data actually moves between machines on a network.", category: "core" },
          { id: "firewalls-vpns", title: "Firewalls & VPNs", description: "Controlling and encrypting traffic at the network boundary.", category: "optional" },
        ],
      },
      {
        id: "owasp",
        title: "Common Vulnerabilities",
        description:
          "The OWASP Top 10 documents the most common and damaging web vulnerabilities — injection attacks, broken authentication, and cross-site scripting show up in real breaches over and over.",
        category: "core",
        children: [
          { id: "injection", title: "Injection Attacks", description: "SQL injection and similar attacks where untrusted input is executed as code.", category: "core", resources: [{ title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" }] },
          { id: "xss", title: "Cross-Site Scripting (XSS)", description: "Injecting malicious scripts into pages viewed by other users.", category: "core" },
        ],
      },
      {
        id: "crypto",
        title: "Cryptography Basics",
        description:
          "You don't need to implement cryptographic algorithms yourself, but understanding hashing, encryption, and how TLS establishes a secure connection is essential to reasoning about what's actually protected.",
        category: "core",
        children: [
          { id: "hashing-encryption", title: "Hashing vs Encryption", description: "Why passwords are hashed, not encrypted, and what that distinction means.", category: "core" },
        ],
      },
      {
        id: "pentesting",
        title: "Penetration Testing",
        description:
          "Ethically attacking systems (with permission) to find vulnerabilities before real attackers do — a structured, methodical process, not random poking.",
        category: "core",
        children: [
          { id: "recon", title: "Reconnaissance", description: "Gathering information about a target before attempting any exploit.", category: "core" },
          { id: "exploitation-basics", title: "Exploitation Basics", description: "Using known vulnerabilities to demonstrate real impact, in a controlled/authorized setting.", category: "optional" },
        ],
      },
      {
        id: "incident-response",
        title: "Incident Response",
        description:
          "When a breach happens, having a plan — containment, investigation, communication, and recovery — determines whether the damage is limited or compounds.",
        category: "optional",
        children: [
          { id: "ir-playbook", title: "Incident Response Playbook", description: "A pre-agreed set of steps for common incident types, so the team isn't improvising under pressure.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "game-developer",
    title: "Game Developer",
    description: "Building interactive games — from core programming to engines and design.",
    group: "role",
    icon: "Gamepad2",
    nodes: [
      {
        id: "programming-game",
        title: "Programming Fundamentals",
        description:
          "C# (for Unity) or C++ (for Unreal) are the standard languages — beyond syntax, game programming leans heavily on math (vectors, trigonometry) for movement and collision.",
        category: "core",
        children: [
          { id: "vector-math-game", title: "Vector Math for Games", description: "Positions, directions, and movement expressed as vectors.", category: "core" },
        ],
      },
      {
        id: "engine",
        title: "Pick an Engine",
        description:
          "Unity is generally more approachable for beginners and 2D/indie games; Unreal Engine is stronger for high-fidelity 3D visuals. Both have huge communities and free learning resources.",
        category: "core",
        children: [
          { id: "unity-basics", title: "Unity Basics", description: "Scenes, GameObjects, and components — Unity's core building blocks.", category: "core", resources: [{ title: "Unity Learn", url: "https://learn.unity.com/" }] },
        ],
      },
      {
        id: "game-loop",
        title: "Game Loop & Physics",
        description:
          "Every game runs an update loop many times per second, checking input, updating state, and rendering — understanding this loop, plus basic collision detection, underlies almost every mechanic you'll build.",
        category: "core",
        children: [
          { id: "collision-detection", title: "Collision Detection", description: "Detecting when two game objects overlap, the basis of most gameplay mechanics.", category: "core" },
        ],
      },
      {
        id: "graphics",
        title: "Graphics & Animation",
        description:
          "Sprite animation for 2D, or skeletal animation and shaders for 3D — bringing static assets to life is what makes a game feel responsive rather than static.",
        category: "core",
        children: [
          { id: "sprite-animation", title: "Sprite Animation", description: "Frame-based animation for 2D characters and effects.", category: "optional" },
        ],
      },
      {
        id: "game-design",
        title: "Game Design Principles",
        description:
          "Balancing difficulty, pacing, and reward is a craft of its own — a technically flawless game with bad pacing still won't be fun to play.",
        category: "optional",
        children: [
          { id: "difficulty-curves", title: "Difficulty Curves", description: "Ramping challenge so players stay engaged without frustration.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "product-manager",
    title: "Product Manager",
    description: "Defining product strategy and guiding teams to build the right thing.",
    group: "role",
    icon: "ClipboardList",
    nodes: [
      {
        id: "product-sense",
        title: "Product Sense",
        description:
          "Product sense is the judgment to identify which user problems are actually worth solving — most product ideas fail not from bad execution, but from solving a problem nobody had.",
        category: "core",
        children: [
          { id: "problem-validation", title: "Problem Validation", description: "Confirming a problem is real and painful before building anything.", category: "core" },
        ],
      },
      {
        id: "discovery",
        title: "User Research & Discovery",
        description:
          "Talking directly to users before committing engineering time catches wrong assumptions early — the cheapest place to be wrong is in a conversation, not in production code.",
        category: "core",
        children: [
          { id: "user-interviews-pm", title: "User Interviews", description: "Asking open-ended questions to understand real workflows and pain points.", category: "core" },
        ],
      },
      {
        id: "roadmapping",
        title: "Roadmapping & Prioritization",
        description:
          "With more good ideas than engineering time, prioritization frameworks (RICE, impact/effort) force explicit trade-offs instead of building whatever was requested loudest.",
        category: "core",
        children: [
          { id: "prioritization-frameworks", title: "Prioritization Frameworks", description: "RICE, impact/effort, and similar structured ways to rank competing ideas.", category: "core" },
        ],
      },
      {
        id: "metrics",
        title: "Metrics & Analytics",
        description:
          "Shipping a feature isn't the finish line — defining success metrics upfront and checking them after launch is how you learn whether it actually worked.",
        category: "core",
        children: [
          { id: "north-star-metric", title: "North Star Metrics", description: "Picking the one metric that best reflects real product value delivered.", category: "optional" },
        ],
      },
      {
        id: "stakeholders",
        title: "Stakeholder Communication",
        description:
          "A PM spends enormous time translating between engineering, design, and business — clear, honest status updates (including bad news) build the trust that makes the role work.",
        category: "optional",
        children: [
          { id: "status-updates", title: "Writing Clear Status Updates", description: "Communicating progress and risk without spin.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "javascript",
    title: "JavaScript",
    description: "The core language of the web, from syntax to asynchronous programming.",
    group: "skill",
    icon: "FileCode",
    nodes: [
      {
        id: "js-basics",
        title: "Syntax & Data Types",
        description:
          "Variables, functions, arrays, and objects are the vocabulary of JavaScript — get fluent enough here that you're not looking up basic syntax constantly.",
        category: "core",
        children: [
          { id: "js-functions", title: "Functions & Scope", description: "Function declarations, arrow functions, and closures.", category: "core", resources: [{ title: "MDN: JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" }] },
          { id: "js-arrays-objects", title: "Arrays & Objects", description: "The two data structures you'll use constantly, plus common array methods (map/filter/reduce).", category: "core" },
        ],
      },
      {
        id: "js-dom-skill",
        title: "The DOM",
        description:
          "The Document Object Model is how JavaScript reads and changes what's on the page — selecting elements and updating them is the bridge between your code and what the user sees.",
        category: "core",
        children: [
          { id: "dom-selection", title: "Selecting & Modifying Elements", description: "querySelector and changing content, classes, and attributes.", category: "core" },
        ],
      },
      {
        id: "js-events",
        title: "Events",
        description:
          "Responding to clicks, input, and other user interaction is what makes a page feel interactive rather than static.",
        category: "core",
        children: [
          { id: "event-listeners", title: "Event Listeners", description: "Attaching behavior to user actions like clicks and form submissions.", category: "core" },
        ],
      },
      {
        id: "js-async-skill",
        title: "Async JavaScript",
        description:
          "Network requests and timers don't complete instantly — Promises and async/await let you write code that waits for them without freezing the page, and understanding this deeply prevents a huge class of bugs.",
        category: "core",
        children: [
          { id: "promises", title: "Promises", description: "Representing a value that will exist in the future, with success/failure handling.", category: "core" },
          { id: "async-await", title: "async/await", description: "Writing asynchronous code that reads like synchronous code.", category: "core" },
        ],
      },
      {
        id: "js-modules",
        title: "Modules & Tooling",
        description:
          "Splitting code into ES modules and understanding what a bundler (Vite, Webpack) does under the hood becomes necessary once a project grows beyond a single file.",
        category: "optional",
        children: [
          { id: "es-modules", title: "ES Modules", description: "import/export syntax for organizing code across files.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "typescript",
    title: "TypeScript",
    description: "Adding static types to JavaScript for safer, more maintainable code.",
    group: "skill",
    icon: "FileCode2",
    nodes: [
      {
        id: "ts-basics",
        title: "Basic Types",
        description:
          "Annotating primitives, arrays, and objects lets the compiler catch a whole class of bugs — like passing a string where a number was expected — before your code ever runs.",
        category: "core",
        children: [
          { id: "primitive-types", title: "Primitives & Arrays", description: "string, number, boolean, and typed arrays.", category: "core", resources: [{ title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" }] },
        ],
      },
      {
        id: "ts-interfaces",
        title: "Interfaces & Types",
        description:
          "Describing the shape of objects with interfaces or type aliases is how TypeScript understands your data — and how your editor gives you accurate autocomplete.",
        category: "core",
        children: [
          { id: "interface-vs-type", title: "Interface vs Type Alias", description: "Two ways to describe object shapes, and when each is preferred.", category: "core" },
          { id: "union-types", title: "Union & Optional Types", description: "Expressing 'this could be one of several types' or 'this field might not exist.'", category: "optional" },
        ],
      },
      {
        id: "ts-generics",
        title: "Generics",
        description:
          "Generics let you write a function or type that works with multiple types while still being fully type-checked — the difference between a reusable utility and a pile of near-duplicate functions.",
        category: "core",
        children: [
          { id: "generic-functions", title: "Generic Functions", description: "Writing a function whose input/output types are linked but not fixed.", category: "core" },
        ],
      },
      {
        id: "ts-config",
        title: "tsconfig & Tooling",
        description:
          "Understanding strict mode and the key tsconfig options determines how much safety net TypeScript actually gives you — a loosely configured project gets far fewer of the benefits.",
        category: "optional",
        children: [
          { id: "strict-mode", title: "Strict Mode", description: "The single setting that enables most of TypeScript's real safety guarantees.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "react",
    title: "React",
    description: "Building component-based user interfaces with the most widely used UI library.",
    group: "skill",
    icon: "Atom",
    nodes: [
      {
        id: "react-components",
        title: "Components & JSX",
        description:
          "Components are reusable, self-contained pieces of UI — JSX lets you write markup directly in JavaScript, which feels unusual at first but makes the relationship between logic and output much clearer.",
        category: "core",
        children: [
          { id: "jsx-basics", title: "JSX Syntax", description: "Embedding expressions and conditionally rendering markup.", category: "core", resources: [{ title: "React docs: Writing Markup with JSX", url: "https://react.dev/learn/writing-markup-with-jsx" }] },
        ],
      },
      {
        id: "react-state",
        title: "State & Props",
        description:
          "Props pass data down into a component; state is data a component owns and can change over time. Understanding when a re-render happens (and why) is the key to debugging most React issues.",
        category: "core",
        children: [
          { id: "usestate", title: "useState", description: "The most common hook for local component state.", category: "core" },
          { id: "props-drilling", title: "Props & Lifting State Up", description: "Sharing state between sibling components by moving it to their common parent.", category: "core" },
        ],
      },
      {
        id: "react-hooks",
        title: "Hooks",
        description:
          "Beyond useState, useEffect (side effects) and useContext (avoiding excessive prop drilling) round out the hooks you'll reach for constantly in real applications.",
        category: "core",
        children: [
          { id: "useeffect", title: "useEffect", description: "Running code in response to renders — fetching data, subscriptions, and cleanup.", category: "core" },
          { id: "usecontext", title: "useContext", description: "Sharing state across many components without passing props through every level.", category: "optional" },
        ],
      },
      {
        id: "react-routing",
        title: "Routing",
        description:
          "Single-page apps need client-side routing to show different views without a full page reload — React Router is the most common library for this outside of full frameworks like Next.js.",
        category: "core",
        children: [
          { id: "react-router-basics", title: "React Router Basics", description: "Defining routes and navigating between pages without a server round-trip.", category: "core" },
        ],
      },
      {
        id: "react-data",
        title: "Data Fetching",
        description:
          "Fetching, caching, and refetching server data correctly is trickier than it looks — libraries like TanStack Query handle loading/error states and caching so you don't reinvent it badly.",
        category: "optional",
        children: [
          { id: "tanstack-query", title: "TanStack Query Basics", description: "Caching and synchronizing server state with your UI automatically.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "nextjs",
    title: "Next.js",
    description: "The React framework for production — routing, rendering, and full-stack features.",
    group: "skill",
    icon: "Hexagon",
    nodes: [
      {
        id: "nextjs-routing",
        title: "App Router",
        description:
          "Next.js's App Router maps your folder structure directly to URLs, and layouts let you share UI (like a navbar) across many pages without repeating code.",
        category: "core",
        children: [
          { id: "file-routing", title: "File-Based Routing", description: "Folders and page.tsx files becoming actual URL routes automatically.", category: "core", resources: [{ title: "Next.js Routing Docs", url: "https://nextjs.org/docs/app/building-your-application/routing" }] },
          { id: "layouts-nextjs", title: "Layouts & Nested Routes", description: "Sharing UI across multiple pages without duplicating it.", category: "core" },
        ],
      },
      {
        id: "nextjs-rendering",
        title: "Rendering Strategies",
        description:
          "Server Components run only on the server (smaller client bundle), while Client Components handle interactivity — knowing when to use each is the biggest mental shift coming from plain React.",
        category: "core",
        children: [
          { id: "server-client-components", title: "Server vs Client Components", description: "The core distinction that shapes how you structure a Next.js app.", category: "core" },
        ],
      },
      {
        id: "nextjs-api",
        title: "API Routes",
        description:
          "Route handlers let you build a real backend (database calls, auth, webhooks) inside the same project as your frontend — no separate server needed for many apps.",
        category: "core",
        children: [
          { id: "route-handlers", title: "Route Handlers", description: "Writing GET/POST/etc. endpoints inside the app directory.", category: "core" },
        ],
      },
      {
        id: "nextjs-deploy",
        title: "Deployment",
        description:
          "Vercel (the framework's creator) offers the smoothest deployment experience, though Next.js apps can also run on most other hosts with a bit more configuration.",
        category: "optional",
        children: [
          { id: "vercel-deploy", title: "Deploying to Vercel", description: "Connecting a Git repo and getting automatic deployments on every push.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "nodejs",
    title: "Node.js",
    description: "Running JavaScript on the server to build APIs and backend services.",
    group: "skill",
    icon: "Terminal",
    nodes: [
      {
        id: "node-basics",
        title: "Node Fundamentals",
        description:
          "Node runs JavaScript outside the browser using an event loop, which means most I/O (file reads, network calls) is non-blocking by default — a different mental model than typical synchronous backend languages.",
        category: "core",
        children: [
          { id: "event-loop", title: "The Event Loop", description: "Why Node handles many concurrent connections efficiently on a single thread.", category: "core" },
          { id: "npm-basics", title: "npm & package.json", description: "Installing and managing dependencies for a Node project.", category: "core" },
        ],
      },
      {
        id: "node-http",
        title: "Building HTTP Servers",
        description:
          "Express (or a similar minimal framework) handles routing and middleware so you're not manually parsing raw HTTP requests — the standard starting point for a Node API.",
        category: "core",
        children: [
          { id: "express-basics", title: "Express Basics", description: "Defining routes and middleware to handle incoming requests.", category: "core", resources: [{ title: "Express.js Guide", url: "https://expressjs.com/en/guide/routing.html" }] },
        ],
      },
      {
        id: "node-db",
        title: "Connecting to Databases",
        description:
          "Whether it's Mongoose for MongoDB or Prisma for SQL databases, an ORM/ODM handles the translation between JavaScript objects and database records.",
        category: "core",
        children: [
          { id: "mongoose-prisma", title: "Mongoose / Prisma", description: "Defining schemas/models and querying your database from Node code.", category: "core" },
        ],
      },
      {
        id: "node-auth",
        title: "Authentication",
        description:
          "Hashing passwords with bcrypt and issuing JWTs or sessions are the standard building blocks for login in a Node API — never store plaintext passwords.",
        category: "optional",
        children: [
          { id: "bcrypt-jwt", title: "bcrypt & JWT", description: "Hashing passwords securely and issuing signed tokens for authenticated sessions.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "sql",
    title: "SQL",
    description: "Querying and managing relational databases.",
    group: "skill",
    icon: "Database",
    nodes: [
      {
        id: "sql-basics",
        title: "SELECT, WHERE, ORDER BY",
        description:
          "The fundamentals of reading data — filtering rows, sorting results, and selecting only the columns you need. Nearly every other SQL skill builds on this.",
        category: "core",
        children: [
          { id: "filtering-sql", title: "Filtering with WHERE", description: "Comparison operators, AND/OR logic, and pattern matching with LIKE.", category: "core", resources: [{ title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/" }] },
        ],
      },
      {
        id: "sql-joins",
        title: "Joins",
        description:
          "Real data lives across multiple related tables — JOINs combine rows from them based on a relationship, and understanding INNER vs LEFT JOIN is essential for getting correct results.",
        category: "core",
        children: [
          { id: "inner-left-join", title: "INNER vs LEFT JOIN", description: "The most common joins and how their results differ when there's no match.", category: "core" },
        ],
      },
      {
        id: "sql-aggregation",
        title: "Aggregation & Grouping",
        description:
          "COUNT, SUM, and GROUP BY let you answer questions like 'how many orders per customer' — summarizing many rows into meaningful totals.",
        category: "core",
        children: [
          { id: "group-by-having", title: "GROUP BY & HAVING", description: "Grouping rows and filtering on the aggregated result.", category: "core" },
        ],
      },
      {
        id: "sql-schema",
        title: "Schema Design",
        description:
          "Normalization reduces data duplication and inconsistency by structuring tables around clear relationships — a well-designed schema prevents a huge class of future bugs.",
        category: "optional",
        children: [
          { id: "normalization", title: "Normalization Basics", description: "Organizing tables to avoid redundant, inconsistent data.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "docker",
    title: "Docker",
    description: "Packaging applications into portable, consistent containers.",
    group: "skill",
    icon: "Container",
    nodes: [
      {
        id: "docker-basics",
        title: "Images & Containers",
        description:
          "An image is a snapshot of everything your app needs to run; a container is a running instance of that image. This separation is what makes Docker apps portable across any machine with Docker installed.",
        category: "core",
        children: [
          { id: "image-vs-container", title: "Image vs Container", description: "The core mental model: images are templates, containers are running instances.", category: "core", resources: [{ title: "Docker Overview", url: "https://docs.docker.com/get-started/overview/" }] },
        ],
      },
      {
        id: "dockerfile",
        title: "Writing Dockerfiles",
        description:
          "A Dockerfile is a recipe for building your image — choosing a base image, copying code, installing dependencies, and specifying the startup command.",
        category: "core",
        children: [
          { id: "dockerfile-layers", title: "Layers & Caching", description: "Ordering Dockerfile instructions to make rebuilds fast.", category: "core" },
        ],
      },
      {
        id: "docker-compose",
        title: "Docker Compose",
        description:
          "Most real apps need more than one container (app + database + cache) — Compose defines and runs a whole multi-container setup with a single command.",
        category: "core",
        children: [
          { id: "compose-yaml", title: "docker-compose.yml", description: "Declaring services, networks, and volumes for a multi-container app.", category: "core" },
        ],
      },
      {
        id: "docker-registry",
        title: "Registries",
        description:
          "Pushing images to Docker Hub or a private registry is how you share an image with a production server or teammate, rather than rebuilding it everywhere.",
        category: "optional",
        children: [
          { id: "docker-hub", title: "Docker Hub Basics", description: "Pushing and pulling images from a public or private registry.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "kubernetes",
    title: "Kubernetes",
    description: "Orchestrating and scaling containerized applications.",
    group: "skill",
    icon: "Boxes",
    nodes: [
      {
        id: "k8s-basics",
        title: "Pods, Deployments, Services",
        description:
          "A Pod is the smallest deployable unit (usually one container); a Deployment manages a set of Pod replicas; a Service gives them a stable network address — these three concepts cover most day-to-day Kubernetes usage.",
        category: "core",
        children: [
          { id: "pods-deployments", title: "Pods & Deployments", description: "Running and scaling replicas of your application automatically.", category: "core", resources: [{ title: "Kubernetes Concepts", url: "https://kubernetes.io/docs/concepts/" }] },
          { id: "services-k8s", title: "Services", description: "Giving a stable address to a set of Pods that may be created/destroyed over time.", category: "core" },
        ],
      },
      {
        id: "k8s-config",
        title: "ConfigMaps & Secrets",
        description:
          "Separating configuration (ConfigMaps) and sensitive values (Secrets) from your container images means you can change settings without rebuilding anything.",
        category: "core",
        children: [
          { id: "configmaps-secrets", title: "Using ConfigMaps & Secrets", description: "Injecting configuration and credentials into running Pods.", category: "core" },
        ],
      },
      {
        id: "k8s-scaling",
        title: "Scaling & Self-healing",
        description:
          "Kubernetes automatically restarts crashed containers and can scale the number of replicas based on load — this is the core value proposition over running containers manually.",
        category: "core",
        children: [
          { id: "hpa", title: "Horizontal Pod Autoscaling", description: "Automatically adding/removing replicas based on CPU or custom metrics.", category: "optional" },
        ],
      },
      {
        id: "k8s-helm",
        title: "Helm",
        description:
          "Helm packages a set of Kubernetes resources as a reusable, configurable \"chart\" — the standard way to install and upgrade complex applications on Kubernetes.",
        category: "optional",
        children: [
          { id: "helm-charts", title: "Helm Charts", description: "Installing and customizing pre-packaged Kubernetes applications.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "aws",
    title: "AWS",
    description: "Core cloud services for hosting, storing, and scaling applications.",
    group: "skill",
    icon: "Cloud",
    nodes: [
      {
        id: "aws-basics",
        title: "IAM & Core Concepts",
        description:
          "IAM (Identity and Access Management) controls who can do what in your AWS account — getting permissions right from the start prevents both security holes and accidental outages.",
        category: "core",
        children: [
          { id: "iam-basics", title: "IAM Users & Roles", description: "The difference between a user (a person) and a role (a set of permissions something can assume).", category: "core", resources: [{ title: "AWS IAM Documentation", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html" }] },
        ],
      },
      {
        id: "ec2-s3",
        title: "EC2 & S3",
        description:
          "EC2 gives you virtual servers to run anything; S3 gives you effectively unlimited object storage for files — together they cover a huge fraction of basic cloud hosting needs.",
        category: "core",
        children: [
          { id: "ec2-basics", title: "EC2 Basics", description: "Launching and connecting to a virtual server in the cloud.", category: "core" },
          { id: "s3-basics", title: "S3 Basics", description: "Storing and serving files (images, backups, static sites) at scale.", category: "core" },
        ],
      },
      {
        id: "aws-serverless",
        title: "Lambda & Serverless",
        description:
          "Lambda runs your code in response to events without you managing any server at all — you pay only for the compute time actually used, which is ideal for spiky or infrequent workloads.",
        category: "core",
        children: [
          { id: "lambda-basics", title: "Lambda Basics", description: "Writing a function that runs in response to an HTTP request or event.", category: "core" },
        ],
      },
      {
        id: "aws-networking",
        title: "VPC & Networking",
        description:
          "A VPC (Virtual Private Cloud) is your own isolated network within AWS — understanding subnets and security groups is necessary once you're running anything beyond a single public server.",
        category: "optional",
        children: [
          { id: "security-groups", title: "Security Groups", description: "Firewall rules controlling what traffic can reach your resources.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "git-github",
    title: "Git & GitHub",
    description: "Version control fundamentals and collaborating on code.",
    group: "skill",
    icon: "GitBranch",
    nodes: [
      {
        id: "git-basics",
        title: "Git Basics",
        description:
          "Commit, branch, and merge are the three verbs you'll use constantly — commits are checkpoints, branches let you work on changes in isolation, and merging brings that work back together.",
        category: "core",
        children: [
          { id: "commits-branches", title: "Commits & Branches", description: "Saving snapshots of your work and isolating changes on separate branches.", category: "core", resources: [{ title: "Git Documentation", url: "https://git-scm.com/doc" }] },
        ],
      },
      {
        id: "git-remote",
        title: "Working with Remotes",
        description:
          "Push, pull, and fetch sync your local repository with a remote one (like GitHub) — understanding the difference between fetch and pull avoids a lot of confusion early on.",
        category: "core",
        children: [
          { id: "push-pull-fetch", title: "push / pull / fetch", description: "Sending and receiving changes between your machine and a remote repository.", category: "core" },
        ],
      },
      {
        id: "git-collab",
        title: "Collaboration Workflow",
        description:
          "Pull requests let teammates review your code before it merges — code review is one of the highest-leverage practices for catching bugs and spreading knowledge across a team.",
        category: "core",
        children: [
          { id: "pull-requests", title: "Pull Requests & Code Review", description: "Proposing changes and getting feedback before merging into the main branch.", category: "core" },
        ],
      },
      {
        id: "git-conflicts",
        title: "Resolving Conflicts",
        description:
          "Merge conflicts happen when two branches change the same lines — they're not a sign you did something wrong, just something every developer needs to get comfortable resolving calmly.",
        category: "optional",
        children: [
          { id: "conflict-resolution", title: "Resolving a Merge Conflict", description: "Reading conflict markers and choosing which changes to keep.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "html",
    title: "HTML",
    description: "The markup language that structures every web page.",
    group: "skill",
    icon: "Code",
    nodes: [
      {
        id: "html-elements",
        title: "Elements & Structure",
        description:
          "Tags, attributes, and the overall document structure (head/body) are the absolute basics — every web page, no matter how complex, is built from these same primitives.",
        category: "core",
        children: [
          { id: "html-tags", title: "Common Tags", description: "Headings, paragraphs, links, images, and lists.", category: "core", resources: [{ title: "MDN: HTML Elements Reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element" }] },
        ],
      },
      {
        id: "html-semantic",
        title: "Semantic HTML",
        description:
          "Using <nav>, <article>, and <section> instead of generic <div>s everywhere gives meaning to your markup — better for accessibility, SEO, and readability for other developers.",
        category: "core",
        children: [
          { id: "semantic-tags", title: "Semantic Tags", description: "header, nav, main, article, and footer as meaningful structural elements.", category: "core" },
        ],
      },
      {
        id: "html-forms",
        title: "Forms",
        description:
          "Forms are how users send data back to your app — input types, labels, and validation attributes cover most real-world data collection needs before you even touch JavaScript.",
        category: "core",
        children: [
          { id: "form-inputs", title: "Input Types & Labels", description: "Text, email, checkbox, and radio inputs, properly associated with labels.", category: "core" },
        ],
      },
      {
        id: "html-a11y",
        title: "Accessible HTML",
        description:
          "Using the right semantic element and alt text often does more for accessibility than any amount of ARIA attributes — accessibility starts with good plain HTML.",
        category: "optional",
        children: [
          { id: "alt-text", title: "Alt Text & Labels", description: "Making images and form controls understandable to screen readers.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "css",
    title: "CSS",
    description: "Styling and laying out web pages.",
    group: "skill",
    icon: "Palette",
    nodes: [
      {
        id: "css-basics",
        title: "Selectors & the Box Model",
        description:
          "Every element on a page is a box with content, padding, border, and margin — understanding the box model explains almost every layout confusion beginners run into.",
        category: "core",
        children: [
          { id: "box-model", title: "The Box Model", description: "How content, padding, border, and margin combine to determine an element's size.", category: "core", resources: [{ title: "MDN: The Box Model", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Introduction_to_the_CSS_box_model" }] },
        ],
      },
      {
        id: "css-flex-grid",
        title: "Flexbox & Grid",
        description:
          "Flexbox handles one-dimensional layouts (a row or column of items); Grid handles two-dimensional layouts (rows and columns together) — between them, they cover nearly all modern layout needs.",
        category: "core",
        children: [
          { id: "flexbox-basics", title: "Flexbox Basics", description: "Aligning and distributing items along a single axis.", category: "core" },
          { id: "grid-basics", title: "CSS Grid Basics", description: "Defining explicit rows and columns for more complex layouts.", category: "core" },
        ],
      },
      {
        id: "css-responsive",
        title: "Responsive Design",
        description:
          "Media queries let your layout adapt to different screen sizes — designing mobile-first (starting small, then adding complexity for larger screens) tends to produce cleaner results.",
        category: "core",
        children: [
          { id: "media-queries", title: "Media Queries", description: "Applying different styles based on viewport width.", category: "core" },
        ],
      },
      {
        id: "css-animations",
        title: "Transitions & Animations",
        description:
          "Subtle transitions on hover/focus states make an interface feel polished — CSS animations handle most simple motion needs without any JavaScript.",
        category: "optional",
        children: [
          { id: "css-transitions", title: "Transitions", description: "Smoothly animating a property change, like a hover color change.", category: "optional" },
        ],
      },
    ],
  },
  {
    slug: "dsa",
    title: "Data Structures & Algorithms",
    description: "The foundations of efficient problem solving, essential for technical interviews.",
    group: "skill",
    icon: "Binary",
    nodes: [
      {
        id: "complexity",
        title: "Big-O & Complexity Analysis",
        description:
          "Big-O notation describes how an algorithm's time or memory usage grows as input size grows — it's the language interviewers use to evaluate whether your solution actually scales.",
        category: "core",
        children: [
          { id: "time-space-complexity", title: "Time & Space Complexity", description: "Reasoning about how runtime and memory usage scale with input size.", category: "core", resources: [{ title: "Big-O Cheat Sheet", url: "https://www.bigocheatsheet.com/" }] },
        ],
      },
      {
        id: "linear-structures",
        title: "Arrays, Linked Lists, Stacks, Queues",
        description:
          "These four structures are the building blocks almost everything else is built from — knowing their trade-offs (random access vs insertion cost) is what lets you pick the right one under pressure.",
        category: "core",
        children: [
          { id: "arrays-linked-lists", title: "Arrays vs Linked Lists", description: "The fundamental trade-off between fast random access and fast insertion/deletion.", category: "core" },
          { id: "stacks-queues", title: "Stacks & Queues", description: "LIFO and FIFO structures used constantly in real algorithms (like BFS/DFS).", category: "core" },
        ],
      },
      {
        id: "trees-graphs",
        title: "Trees & Graphs",
        description:
          "Trees model hierarchical data (file systems, DOM trees); graphs model networks of relationships (social networks, maps). Traversal algorithms (DFS/BFS) on both show up constantly in interviews.",
        category: "core",
        children: [
          { id: "binary-trees", title: "Binary Trees", description: "Tree traversal (in-order, pre-order, post-order) and binary search trees.", category: "core" },
          { id: "graph-traversal", title: "Graph Traversal (BFS/DFS)", description: "The two fundamental ways to explore a graph, each with different use cases.", category: "core" },
        ],
      },
      {
        id: "sorting-searching",
        title: "Sorting & Searching",
        description:
          "Understanding how merge sort and quicksort actually work (not just that they exist) builds the intuition needed for a huge range of other algorithm problems, and binary search is one of the highest-leverage techniques to master cold.",
        category: "core",
        children: [
          { id: "sorting-algos", title: "Common Sorting Algorithms", description: "Merge sort, quicksort, and their time complexity trade-offs.", category: "core" },
          { id: "binary-search", title: "Binary Search", description: "Efficiently searching sorted data in logarithmic time.", category: "core" },
        ],
      },
      {
        id: "dp",
        title: "Dynamic Programming",
        description:
          "DP solves problems by breaking them into overlapping subproblems and caching results — often the hardest topic for interview prep, but a handful of common patterns cover most problems you'll actually see.",
        category: "optional",
        children: [
          { id: "memoization", title: "Memoization", description: "Caching results of expensive function calls to avoid recomputing them.", category: "optional" },
        ],
      },
    ],
  },
];

export default stubs;
