import type { RoadmapData } from "./types";

const systemDesign: RoadmapData = {
  slug: "system-design",
  title: "System Design",
  description:
    "How to reason about designing large-scale, reliable, and scalable software systems.",
  group: "skill",
  icon: "Network",
  nodes: [
    {
      id: "fundamentals",
      title: "Fundamentals",
      description: "Concepts every system design conversation starts from.",
      category: "core",
      children: [
        { id: "client-server", title: "Client-Server Model", description: "How requests actually flow.", category: "core" },
        { id: "ip-dns", title: "IP, DNS & OSI Model (brief)", description: "Just enough networking to reason about latency and routing.", category: "optional" },
        { id: "http-basics", title: "HTTP/HTTPS & APIs", description: "REST, status codes, headers.", category: "core" },
      ],
    },
    {
      id: "scaling",
      title: "Scaling Fundamentals",
      description: "How systems grow to handle more load.",
      category: "core",
      children: [
        { id: "vertical-horizontal", title: "Vertical vs Horizontal Scaling", description: "Bigger machines vs more machines.", category: "core" },
        { id: "load-balancing", title: "Load Balancing", description: "Distributing traffic across servers.", category: "core", resources: [{ title: "AWS: What is Load Balancing?", url: "https://aws.amazon.com/what-is/load-balancing/" }] },
        { id: "caching", title: "Caching", description: "CDNs, in-memory caches (Redis), cache invalidation.", category: "core" },
      ],
    },
    {
      id: "databases",
      title: "Databases at Scale",
      description: "Storing and retrieving data reliably as volume grows.",
      category: "core",
      children: [
        { id: "sql-vs-nosql", title: "SQL vs NoSQL", description: "Choosing the right storage model.", category: "core" },
        { id: "replication", title: "Replication", description: "Keeping copies of data in sync.", category: "core" },
        { id: "sharding", title: "Sharding / Partitioning", description: "Splitting data across multiple databases.", category: "core" },
        { id: "indexing", title: "Indexing", description: "Making reads fast.", category: "optional" },
      ],
    },
    {
      id: "consistency",
      title: "Consistency & Availability",
      description: "The trade-offs every distributed system has to make.",
      category: "core",
      children: [
        { id: "cap-theorem", title: "CAP Theorem", description: "Consistency, Availability, Partition tolerance — pick two.", category: "core" },
        { id: "eventual-consistency", title: "Eventual Consistency", description: "Why some systems accept temporary staleness.", category: "optional" },
      ],
    },
    {
      id: "messaging",
      title: "Async Communication",
      description: "Decoupling services so they don't block each other.",
      category: "core",
      children: [
        { id: "queues", title: "Message Queues", description: "Kafka, RabbitMQ, SQS — decoupled processing.", category: "core" },
        { id: "pub-sub", title: "Pub/Sub Patterns", description: "Broadcasting events to multiple consumers.", category: "optional" },
      ],
    },
    {
      id: "architecture",
      title: "Architecture Patterns",
      description: "Structuring a system's services.",
      category: "core",
      children: [
        { id: "monolith-microservices", title: "Monolith vs Microservices", description: "When to split, and when not to.", category: "core" },
        { id: "api-gateway", title: "API Gateway", description: "A single entry point for client requests.", category: "optional" },
      ],
    },
    {
      id: "reliability",
      title: "Reliability & Observability",
      description: "Keeping systems up, and knowing when they're not.",
      category: "optional",
      children: [
        { id: "rate-limiting", title: "Rate Limiting", description: "Protecting services from overload.", category: "optional" },
        { id: "monitoring", title: "Monitoring & Logging", description: "Knowing what's happening in production.", category: "optional" },
      ],
    },
    {
      id: "case-studies",
      title: "Practice: Design Common Systems",
      description: "Applying the above to real interview-style prompts.",
      category: "optional",
      children: [
        { id: "url-shortener", title: "Design a URL Shortener", description: "A classic starter system design problem.", category: "optional" },
        { id: "news-feed", title: "Design a News Feed", description: "Fan-out, ranking, and caching at scale.", category: "optional" },
      ],
    },
  ],
};

export default systemDesign;
