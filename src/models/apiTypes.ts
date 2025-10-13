export interface ResourceItem {
  id: string;
  type: string;
  title: string;
  description: string;
  link: string;
  thumbnail?: string;
  author?: string;
  source?: string;
  publishedAt?: string;
}

export interface ApiResponse {
  success: boolean;
  topic: string;
  overview: {
    content: string;
    generatedBy: string;
  };
  resources: {
    videos: ResourceItem[];
    articles: ResourceItem[];
    news: ResourceItem[];
  };
  stats: {
    totalVideos: number;
    totalArticles: number;
    totalNews: number;
    totalResources: number;
  };
}
