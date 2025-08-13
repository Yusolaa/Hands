"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Hand,
  Search,
  Filter,
  Clock,
  ExternalLink,
  Bookmark,
  Share2,
  Loader2,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Globe,
  LucideIcon,
  Menu,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { NewsService, NewsArticle, NewsCategory } from "@/lib/newsService";

interface Category {
  id: NewsCategory | "general";
  label: string;
  icon: LucideIcon;
}

const categories: Category[] = [
  { id: "general", label: "General", icon: Globe },
  { id: "business", label: "Business", icon: TrendingUp },
  { id: "technology", label: "Technology", icon: Loader2 },
  { id: "entertainment", label: "Entertainment", icon: Clock },
  { id: "health", label: "Health", icon: AlertCircle },
  { id: "science", label: "Science", icon: RefreshCw },
  { id: "sports", label: "Sports", icon: TrendingUp },
];

interface ArticleCardProps {
  article: NewsArticle;
  index: number;
  selectedCategory: string;
  bookmarkedArticles: Set<string>;
  onToggleBookmark: (url: string) => void;
  onShare: (article: NewsArticle) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  index,
  selectedCategory,
  bookmarkedArticles,
  onToggleBookmark,
  onShare,
}) => (
  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
    <div className="relative">
      {article.urlToImage && (
        <div className="relative h-40 xs:h-44 sm:h-48 md:h-52 lg:h-56 overflow-hidden">
          <Image
            src={article.urlToImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLElement;
              target.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-2 left-2 xs:top-3 xs:left-3">
            <span className="bg-blue-600/90 text-white px-1.5 py-0.5 xs:px-2 xs:py-1 rounded-full text-xs font-medium backdrop-blur-sm">
              {NewsService.formatSource(article.source)}
            </span>
          </div>
        </div>
      )}

      <div className="p-3 xs:p-4 sm:p-5 md:p-6">
        <div className="flex items-center justify-between mb-2 xs:mb-3">
          <div className="flex items-center space-x-1 xs:space-x-2 text-xs xs:text-sm text-gray-500">
            <Clock size={12} className="xs:hidden" />
            <Clock size={14} className="hidden xs:block" />
            <span className="truncate">
              {NewsService.getTimeAgo(article.publishedAt)}
            </span>
          </div>

          <div className="flex items-center space-x-1 xs:space-x-2">
            <button
              onClick={() => onToggleBookmark(article.url)}
              className={`p-1 xs:p-1.5 rounded-full transition-colors ${
                bookmarkedArticles.has(article.url)
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              }`}
              aria-label={
                bookmarkedArticles.has(article.url)
                  ? "Remove bookmark"
                  : "Add bookmark"
              }
            >
              <Bookmark
                size={14}
                className="xs:hidden"
                fill={
                  bookmarkedArticles.has(article.url) ? "currentColor" : "none"
                }
              />
              <Bookmark
                size={16}
                className="hidden xs:block"
                fill={
                  bookmarkedArticles.has(article.url) ? "currentColor" : "none"
                }
              />
            </button>

            <button
              onClick={() => onShare(article)}
              className="p-1 xs:p-1.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label="Share article"
            >
              <Share2 size={14} className="xs:hidden" />
              <Share2 size={16} className="hidden xs:block" />
            </button>
          </div>
        </div>

        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 xs:mb-3 line-clamp-2 group-hover:text-blue-900 transition-colors leading-tight">
          {article.title}
        </h2>

        <p className="text-gray-600 text-xs xs:text-sm sm:text-base leading-relaxed mb-3 xs:mb-4 line-clamp-3">
          {article.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 xs:px-2 xs:py-1 rounded-full truncate max-w-[100px] xs:max-w-none">
            {selectedCategory.charAt(0).toUpperCase() +
              selectedCategory.slice(1)}
          </span>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium text-xs xs:text-sm transition-colors shrink-0"
          >
            <span className="hidden xs:inline">Read more</span>
            <span className="xs:hidden">Read</span>
            <ExternalLink size={12} className="xs:hidden" />
            <ExternalLink size={14} className="hidden xs:block" />
          </a>
        </div>
      </div>
    </div>
  </Card>
);

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<Category["id"]>("general");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [gestureMode, setGestureMode] = useState<boolean>(false);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<string>>(
    new Set()
  );
  const [showMobileCategories, setShowMobileCategories] =
    useState<boolean>(false);

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      let response;
      if (isSearchMode && searchQuery.trim()) {
        response = await NewsService.searchNews(searchQuery);
      } else {
        const category =
          selectedCategory === "general"
            ? null
            : (selectedCategory as NewsCategory);
        response = await NewsService.getTopHeadlines("us", category);
      }

      setArticles(response.articles);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setIsSearchMode(false);
      fetchNews();
      return;
    }

    setIsSearchMode(true);
    await fetchNews();
  };

  const toggleBookmark = (articleUrl: string): void => {
    const newBookmarks = new Set(bookmarkedArticles);
    if (newBookmarks.has(articleUrl)) {
      newBookmarks.delete(articleUrl);
    } else {
      newBookmarks.add(articleUrl);
    }
    setBookmarkedArticles(newBookmarks);
  };

  const shareArticle = async (article: NewsArticle): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(article.url);
      } catch (err) {
        console.log("Error copying to clipboard:", err);
      }
    }
  };

  const handleCategoryChange = (categoryId: Category["id"]): void => {
    setSelectedCategory(categoryId);
    setIsSearchMode(false);
    setSearchQuery("");
    setShowMobileCategories(false);
  };

  const handleSearchInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen ">
      {/* Header - Mobile Optimized */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="w-full px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 xs:h-16 sm:h-20">
            {/* Logo - Responsive */}
            <div className="flex items-center space-x-2 xs:space-x-3">
              <div className="flex gap-2 items-center">
                <Image
                  src="/favicon.svg"
                  alt="Hands Logo"
                  width={40}
                  height={40}
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                />
              </div>
              <div className="hidden sm:block w-px h-4 xs:h-6 bg-gray-300" />
              <span className="hidden sm:inline text-gray-600 font-medium text-sm xs:text-base">
                News
              </span>
            </div>

            {/* Gesture Mode Toggle - Mobile Optimized */}
            <button
              onClick={() => setGestureMode(!gestureMode)}
              className={`flex items-center space-x-1 xs:space-x-2 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl text-xs xs:text-sm font-medium transition-all ${
                gestureMode
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
              }`}
              aria-label={
                gestureMode ? "Disable gesture mode" : "Enable gesture mode"
              }
            >
              <span className="hidden xs:inline">
                {gestureMode ? "Gesture ON" : "Gestures"}
              </span>
              <span className="xs:hidden">{gestureMode ? "ON" : "OFF"}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="w-full px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8 max-w-7xl mx-auto">
        {/* Search and Filters - Mobile First */}
        <div className="mb-6 xs:mb-8 space-y-4 xs:space-y-6">
          {/* Search Bar - Responsive */}
          <form onSubmit={handleSearch} className="relative w-full">
            <div className="relative">
              <Search
                className="absolute left-3 xs:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="w-full pl-10 xs:pl-12 pr-16 xs:pr-20 py-3 xs:py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl xs:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm xs:text-base"
              />
              <button
                type="submit"
                className="absolute right-1 xs:right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 xs:px-4 lg:px-6 py-1.5 xs:py-2 rounded-lg xs:rounded-xl hover:bg-blue-700 transition-colors font-medium text-xs xs:text-sm"
              >
                <Search size={16} className="xs:hidden" />
                <span className="hidden xs:inline">Search</span>
              </button>
            </div>
          </form>

          {/* Category Filter - Mobile Optimized */}
          <div className="w-full">
            {/* Mobile Category Toggle */}
            <button
              onClick={() => setShowMobileCategories(!showMobileCategories)}
              className="sm:hidden w-full flex items-center justify-between bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-gray-200 text-gray-700 font-medium"
            >
              <div className="flex items-center space-x-2">
                <Filter size={16} />
                <span>
                  {categories.find((cat) => cat.id === selectedCategory)
                    ?.label || "General"}
                </span>
              </div>
              {showMobileCategories ? <X size={16} /> : <Menu size={16} />}
            </button>

            {/* Mobile Category Dropdown */}
            {showMobileCategories && (
              <div className="sm:hidden mt-2 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-2 space-y-1">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all font-medium text-left ${
                        selectedCategory === category.id
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      <IconComponent size={16} />
                      <span>{category.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Desktop Category Pills */}
            <div className="hidden sm:flex items-center justify-center">
              <div className="inline-flex flex-wrap items-center gap-1 md:gap-2 bg-white/60 backdrop-blur-sm p-2 rounded-2xl border border-gray-200 max-w-full">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-1.5 md:py-2 rounded-xl transition-all font-medium text-xs md:text-sm ${
                        selectedCategory === category.id
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-white hover:text-blue-600"
                      }`}
                    >
                      <IconComponent size={14} className="md:hidden" />
                      <IconComponent size={16} className="hidden md:block" />
                      <span className="hidden lg:inline">{category.label}</span>
                      <span className="lg:hidden">
                        {category.label.slice(0, 3)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16 xs:py-20">
            <div className="text-center">
              <Loader2
                className="animate-spin text-blue-600 mx-auto mb-4"
                size={40}
              />
              <p className="text-gray-600 font-medium text-sm xs:text-base">
                Loading latest news...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16 xs:py-20">
            <div className="text-center px-4">
              <AlertCircle className="text-red-500 mx-auto mb-4" size={40} />
              <h3 className="text-lg xs:text-xl font-semibold text-gray-900 mb-2">
                Failed to load news
              </h3>
              <p className="text-gray-600 mb-6 text-sm xs:text-base">{error}</p>
              <button
                onClick={fetchNews}
                className="bg-blue-600 text-white px-4 xs:px-6 py-2 xs:py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm xs:text-base"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Results Header - Mobile Optimized */}
            <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-4 xs:mb-6 gap-3 xs:gap-0">
              <div>
                <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  {isSearchMode
                    ? `Results for "${
                        searchQuery.length > 20
                          ? searchQuery.slice(0, 20) + "..."
                          : searchQuery
                      }"`
                    : `${
                        selectedCategory.charAt(0).toUpperCase() +
                        selectedCategory.slice(1)
                      } News`}
                </h2>
                <p className="text-gray-600 mt-1 text-xs xs:text-sm">
                  {articles.length} articles found
                </p>
              </div>

              <button
                onClick={fetchNews}
                className="flex items-center justify-center xs:justify-start space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm xs:text-base self-start xs:self-auto"
              >
                <RefreshCw size={14} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Articles Grid - Fully Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xs:gap-5 sm:gap-6 lg:gap-8">
              {articles.map((article, index) => (
                <ArticleCard
                  key={`${article.url}-${index}`}
                  article={article}
                  index={index}
                  selectedCategory={selectedCategory}
                  bookmarkedArticles={bookmarkedArticles}
                  onToggleBookmark={toggleBookmark}
                  onShare={shareArticle}
                />
              ))}
            </div>

            {articles.length === 0 && (
              <div className="text-center py-16 xs:py-20 px-4">
                <Search className="text-gray-400 mx-auto mb-4" size={40} />
                <h3 className="text-lg xs:text-xl font-semibold text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 text-sm xs:text-base">
                  {isSearchMode
                    ? "Try adjusting your search terms"
                    : "No articles available in this category"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
