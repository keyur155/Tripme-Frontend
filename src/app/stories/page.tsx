"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Clock, 
  Heart, 
  Eye, 
  MessageCircle,
  Plus,
  BookOpen,
  Mountain,
  Waves,
  Building2,
  Camera,
  Coffee,
  TreePine,
  Star,
  Globe,
  Award,
  Calendar,
  User,
  Tag,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Compass,
  PenTool,
  Share2,
  Search
} from 'lucide-react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { apiClient } from '@/infrastructure/api/clients/api-client';
import { useAuth } from '@/core/store/auth-context';

interface Story {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  readTime: number;
  views: number;
  likes: string[];
  comments: any[];
  author: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  tags: string[];
  location?: {
    city: string;
    state: string;
    country: string;
  };
  createdAt: string;
}

interface Category {
  _id: string;
  count: number;
}

const StoriesPage = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showStorySearch, setShowStorySearch] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const storySearchRef = React.useRef<HTMLInputElement>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchStories();
    fetchCategories();
  }, [currentPage, selectedCategory, debouncedSearch, sortBy, sortOrder]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sortBy,
        sortOrder
      });

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      let endpoint = `${process.env.NEXT_PUBLIC_API_URL}/stories`;

      if (debouncedSearch) {
        params.append('q', debouncedSearch);
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/stories/search`;
      }

      const response = await fetch(`${endpoint}?${params}`);
      const data = await response.json();

      if (data.success) {
        setStories(data.data.stories);
        setTotalPages(data.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stories/categories`);
      const data = await response.json();

      if (data.success) {
        setCategories(data.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Adventure':
        return <Mountain className="w-4 h-4" />;
      case 'Beach':
        return <Waves className="w-4 h-4" />;
      case 'City':
        return <Building2 className="w-4 h-4" />;
      case 'Photography':
        return <Camera className="w-4 h-4" />;
      case 'Food':
        return <Coffee className="w-4 h-4" />;
      case 'Nature':
        return <TreePine className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCreateStory = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    router.push('/stories/create');
  };

  if (loading && stories.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF8F3]">
        <Header />
        <div className="pt-48 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#F5E6D3] border-t-[#C45D3E] rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading stories</h2>
            <p className="text-gray-600">Finding amazing travel stories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Header />
      
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#C45D3E]/5 via-[#F5E6D3]/20 to-[#2D5F3A]/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-[#C45D3E] font-semibold text-sm mb-6 shadow-lg">
                <Sparkles className="w-4 h-4" />
                Share Your Journey
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#1A1A1A] via-[#C45D3E] to-[#1A1A1A] bg-clip-text text-transparent mb-6 leading-tight">
                Travel Stories
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Discover incredible adventures, hidden gems, and unforgettable experiences shared by fellow travelers from around the world.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleCreateStory}
                  className="bg-[#C45D3E] hover:bg-[#A84B32] text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 border-0 shadow-xl"
                >
                  <PenTool className="w-5 h-5 mr-2" />
                  Write Your Story
                </Button>
                <Button 
                  onClick={() => {
                    setShowStorySearch(true);
                    setTimeout(() => storySearchRef.current?.focus(), 100);
                  }}
                  className="bg-white border border-gray-200 text-[#1A1A1A] hover:bg-gray-50 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl shadow-sm"
                >
                  <Search className="w-5 h-5 mr-2 text-[#C45D3E]" />
                  Search Stories
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Story Search Bar */}
        {showStorySearch && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={storySearchRef}
                type="text"
                placeholder="Search stories by title, tag, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white border border-[#F5E6D3] rounded-2xl shadow-lg focus:ring-2 focus:ring-[#C45D3E] focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <span className="text-gray-600 text-xs font-bold">✕</span>
                </button>
              )}
            </div>
          </div>
        )}


        {/* Featured Stories Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Stories</h2>
              <p className="text-gray-600">Handpicked adventures that inspire wanderlust</p>
            </div>
            <Button variant="outline" className="border-[#F5E6D3] text-[#C45D3E] hover:bg-[#FDF8F3]">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {stories.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-[#F5E6D3] rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-[#C45D3E]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No stories yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Be the first to share your amazing travel story and inspire others to explore the world!
              </p>
              <Button 
                onClick={handleCreateStory}
                className="bg-[#C45D3E] hover:bg-[#A84B32] text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 border-0 shadow-xl"
              >
                <PenTool className="w-5 h-5 mr-2" />
                Start Writing
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story, index) => (
                <Card 
                  key={story._id}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden group"
                  onClick={() => router.push(`/stories/${story._id}`)}
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={story.featuredImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                        {getCategoryIcon(story.category)}
                        <span>{story.category}</span>
                      </div>
                    </div>
                    
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 drop-shadow-lg">{story.title}</h3>
                      <div className="flex items-center gap-4 text-white/90 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{story.readTime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{story.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{story.likes.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#C45D3E] rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{story.author.name}</div>
                        <div className="text-sm text-gray-500">{formatDate(story.createdAt)}</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{story.excerpt}</p>
                    
                    {story.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{story.location.city}, {story.location.country}</span>
                      </div>
                    )}
                    
                    {story.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {story.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className="text-xs bg-[#F5E6D3] text-[#C45D3E] px-3 py-1 rounded-full font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-[#C45D3E] to-[#A84B32] py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Share Your Story?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who are sharing their adventures and inspiring others to explore the world.
            </p>
            <Button 
              onClick={handleCreateStory}
              className="bg-white text-[#C45D3E] hover:bg-gray-50 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 border-0 shadow-xl"
            >
              <PenTool className="w-5 h-5 mr-2" />
              Start Writing Now
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StoriesPage; 