// lib/newsService.ts

export interface NewsSource {
  id: string | null;
  name: string;
}

export interface NewsArticle {
  source: NewsSource;
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  articles: NewsArticle[];
  totalResults: number;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
  code?: string;
  message?: string;
}

export type NewsCategory =
  | "business"
  | "entertainment"
  | "general"
  | "health"
  | "science"
  | "sports"
  | "technology";

export type SortBy = "relevancy" | "popularity" | "publishedAt";

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = process.env.BASE_URL;

export class NewsService {
  static async getTopHeadlines(
    country: string = "us",
    category: NewsCategory | null = null,
    pageSize: number = 20
  ): Promise<NewsResponse> {
    try {
      if (!NEWS_API_KEY) {
        throw new Error("News API key is not configured");
      }

      const params = new URLSearchParams({
        country,
        apiKey: NEWS_API_KEY,
        pageSize: pageSize.toString(),
      });

      if (category) {
        params.append("category", category);
      }

      const response = await fetch(`${BASE_URL}/top-headlines?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NewsApiResponse = await response.json();

      if (data.status !== "ok") {
        throw new Error(data.message || "Failed to fetch news");
      }

      return {
        articles: data.articles.filter(
          (article: NewsArticle) =>
            article.title &&
            article.description &&
            article.title !== "[Removed]" &&
            article.description !== "[Removed]"
        ),
        totalResults: data.totalResults,
      };
    } catch (error) {
      console.error("Error fetching news:", error);
      throw error;
    }
  }

  static async searchNews(
    query: string,
    sortBy: SortBy = "publishedAt",
    pageSize: number = 20
  ): Promise<NewsResponse> {
    try {
      if (!NEWS_API_KEY) {
        throw new Error("News API key is not configured");
      }

      const params = new URLSearchParams({
        q: query,
        sortBy,
        apiKey: NEWS_API_KEY,
        pageSize: pageSize.toString(),
        language: "en",
      });

      const response = await fetch(`${BASE_URL}/everything?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NewsApiResponse = await response.json();

      if (data.status !== "ok") {
        throw new Error(data.message || "Failed to search news");
      }

      return {
        articles: data.articles.filter(
          (article: NewsArticle) =>
            article.title &&
            article.description &&
            article.title !== "[Removed]" &&
            article.description !== "[Removed]"
        ),
        totalResults: data.totalResults,
      };
    } catch (error) {
      console.error("Error searching news:", error);
      throw error;
    }
  }

  static getTimeAgo(dateString: string): string {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInMs = now.getTime() - publishedDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return publishedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          publishedDate.getFullYear() !== now.getFullYear()
            ? "numeric"
            : undefined,
      });
    }
  }

  static formatSource(source: NewsSource): string {
    if (!source || !source.name) return "Unknown Source";

    // Clean up common source name patterns
    return source.name
      .replace(/\.com$/, "")
      .replace(/^The /, "")
      .trim();
  }
}
