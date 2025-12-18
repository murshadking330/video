
export interface VideoMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  shortUrl: string;
  slug: string;
  aiTitle: string;
  aiDescription: string;
  tags: string[];
  createdAt: number;
}

export interface GeminiResponse {
  slug: string;
  title: string;
  description: string;
  tags: string[];
}
