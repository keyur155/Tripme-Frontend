"use client";
import React, { memo } from 'react';
import {
  Heart,
  Star,
  Shield,
  Sparkles,
  Zap,
  Clock,
  TrendingUp,
  CheckCircle,
  Tag,
  Flame,
  Award,
  Crown,
  Users,
  MapPin,
  Lock,
  AlertCircle,
} from 'lucide-react';

// Badge type definitions
export type BadgeType =
  | 'guest_favorite'
  | 'superhost'
  | 'super_host'
  | 'rare_find'
  | 'new'
  | 'new_listing'
  | 'new_host'
  | 'trending'
  | 'verified'
  | 'top_rated'
  | 'top_5_percent'
  | 'instant_book'
  | 'discount'
  | 'limited_availability'
  | 'limited_slots'
  | 'only_one_left'
  | 'featured'
  | 'sponsored'
  | 'checkin'
  | 'cleanliness'
  | 'location'
  | 'value'
  | 'host_exp'
  | 'price_low'
  | 'high_demand';

export type BadgeVariant = 'pill' | 'subtle' | 'outline' | 'solid' | 'ghost';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
export type BadgeCategory = 'highlight' | 'details' | 'insights' | 'urgency' | 'trust' | 'promo';

export interface BadgeConfig {
  type: BadgeType;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  priority: number;
  category: BadgeCategory;
}

// Centralized badge configuration - Airbnb style
export const BADGE_CONFIG: Record<BadgeType, Omit<BadgeConfig, 'type'>> = {
  // Highlight badges (highest priority)
  guest_favorite: {
    label: 'Guest favourite',
    icon: <Crown className="w-3.5 h-3.5" />,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    priority: 1,
    category: 'highlight',
  },
  superhost: {
    label: 'Superhost',
    icon: <Shield className="w-3.5 h-3.5" />,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    priority: 2,
    category: 'highlight',
  },
  super_host: {
    label: 'Superhost',
    icon: <Shield className="w-3.5 h-3.5" />,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    priority: 2,
    category: 'highlight',
  },
  rare_find: {
    label: 'Rare find',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    color: 'text-[#C45D3E]',
    bgColor: 'bg-[#FDF8F3]',
    borderColor: 'border-[#F5E6D3]',
    priority: 3,
    category: 'highlight',
  },
  top_rated: {
    label: 'Top rated',
    icon: <Star className="w-3.5 h-3.5" />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    priority: 4,
    category: 'highlight',
  },
  top_5_percent: {
    label: 'Top 5% of homes',
    icon: <Award className="w-3.5 h-3.5" />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    priority: 4,
    category: 'highlight',
  },
  new: {
    label: 'New',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    priority: 5,
    category: 'highlight',
  },
  new_listing: {
    label: 'New',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    priority: 5,
    category: 'highlight',
  },
  new_host: {
    label: 'New host',
    icon: <Users className="w-3.5 h-3.5" />,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    priority: 6,
    category: 'highlight',
  },
  trending: {
    label: 'Trending',
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    priority: 7,
    category: 'highlight',
  },
  verified: {
    label: 'Verified',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    color: 'text-[#2D5F3A]',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    priority: 8,
    category: 'trust',
  },
  instant_book: {
    label: 'Instant Book',
    icon: <Zap className="w-3.5 h-3.5" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    priority: 9,
    category: 'trust',
  },

  // Detail badges
  checkin: {
    label: 'Great check-in',
    icon: <Lock className="w-3.5 h-3.5" />,
    color: 'text-[#C45D3E]',
    bgColor: 'bg-[#FDF8F3]',
    borderColor: 'border-[#F5E6D3]',
    priority: 20,
    category: 'details',
  },
  cleanliness: {
    label: 'Sparkling clean',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    priority: 21,
    category: 'details',
  },
  location: {
    label: 'Great location',
    icon: <MapPin className="w-3.5 h-3.5" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    priority: 22,
    category: 'details',
  },
  value: {
    label: 'Great value',
    icon: <Tag className="w-3.5 h-3.5" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    priority: 23,
    category: 'details',
  },
  host_exp: {
    label: 'Experienced host',
    icon: <Users className="w-3.5 h-3.5" />,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    priority: 24,
    category: 'details',
  },

  // Insight badges
  price_low: {
    label: 'Lower price',
    icon: <Tag className="w-3.5 h-3.5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    priority: 30,
    category: 'insights',
  },
  high_demand: {
    label: 'In high demand',
    icon: <Flame className="w-3.5 h-3.5" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    priority: 31,
    category: 'insights',
  },

  // Urgency badges
  limited_availability: {
    label: 'Limited availability',
    icon: <Clock className="w-3.5 h-3.5" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    priority: 40,
    category: 'urgency',
  },
  limited_slots: {
    label: 'Limited availability',
    icon: <Clock className="w-3.5 h-3.5" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    priority: 40,
    category: 'urgency',
  },
  only_one_left: {
    label: 'Only 1 left',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    priority: 41,
    category: 'urgency',
  },

  // Promo badges
  discount: {
    label: 'Discount',
    icon: <Tag className="w-3.5 h-3.5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    priority: 50,
    category: 'promo',
  },
  featured: {
    label: 'Featured',
    icon: <Star className="w-3.5 h-3.5" />,
    color: 'text-[#B8860B]',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    priority: 51,
    category: 'promo',
  },
  sponsored: {
    label: 'Sponsored',
    icon: <Award className="w-3.5 h-3.5" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    priority: 52,
    category: 'promo',
  },
};

// Get badge config with fallback
export const getBadgeConfig = (type: string): BadgeConfig | null => {
  const normalizedType = type.toLowerCase().replace(/-/g, '_') as BadgeType;
  const config = BADGE_CONFIG[normalizedType];
  if (!config) return null;
  return { type: normalizedType, ...config };
};

// Badge component props
export interface BadgeProps {
  type?: BadgeType | string;
  label?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  showIcon?: boolean;
  className?: string;
  onClick?: () => void;
}

// Size configurations
const SIZE_CLASSES: Record<BadgeSize, string> = {
  xs: 'text-[10px] px-1.5 py-0.5 gap-0.5',
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
  lg: 'text-sm px-3 py-1.5 gap-2',
};

const ICON_SIZE_CLASSES: Record<BadgeSize, string> = {
  xs: '[&>svg]:w-2.5 [&>svg]:h-2.5',
  sm: '[&>svg]:w-3 [&>svg]:h-3',
  md: '[&>svg]:w-3.5 [&>svg]:h-3.5',
  lg: '[&>svg]:w-4 [&>svg]:h-4',
};

// Single Badge Component
export const Badge = memo(function Badge({
  type,
  label,
  variant = 'subtle',
  size = 'sm',
  showIcon = true,
  className = '',
  onClick,
}: BadgeProps) {
  // Get config if type provided
  const config = type ? getBadgeConfig(type) : null;
  
  // If no config and no label, render nothing
  if (!config && !label) return null;
  
  const displayLabel = label || config?.label;
  if (!displayLabel) return null;

  const icon = config?.icon;
  const colorClass = config?.color || 'text-gray-600';
  const bgClass = config?.bgColor || 'bg-gray-50';
  const borderClass = config?.borderColor || 'border-gray-200';

  // Variant styles
  const variantClasses: Record<BadgeVariant, string> = {
    pill: `${bgClass} ${colorClass} border ${borderClass}`,
    subtle: `${bgClass} ${colorClass}`,
    outline: `bg-transparent ${colorClass} border ${borderClass}`,
    solid: `${bgClass.replace('50', '500')} text-white`,
    ghost: `bg-transparent ${colorClass} hover:${bgClass}`,
  };

  return (
    <span
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={`
        inline-flex items-center font-medium rounded-full whitespace-nowrap
        transition-all duration-200
        ${SIZE_CLASSES[size]}
        ${ICON_SIZE_CLASSES[size]}
        ${variantClasses[variant]}
        ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
        ${className}
      `}
      aria-label={displayLabel}
    >
      {showIcon && icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{displayLabel}</span>
    </span>
  );
});

// Badge data interface for external use
export interface BadgeData {
  type: string;
  label: string;
  priority?: number;
}

// Badge Group Props
export interface BadgeGroupProps {
  badges?: BadgeData[];
  variant?: BadgeVariant;
  size?: BadgeSize;
  showIcon?: boolean;
  maxVisible?: number;
  className?: string;
  gap?: 'tight' | 'normal' | 'loose';
}

const GAP_CLASSES = {
  tight: 'gap-1',
  normal: 'gap-1.5',
  loose: 'gap-2',
};

// Badge Group Component - renders multiple badges with overflow handling
export const BadgeGroup = memo(function BadgeGroup({
  badges,
  variant = 'subtle',
  size = 'sm',
  showIcon = true,
  maxVisible = 3,
  className = '',
  gap = 'normal',
}: BadgeGroupProps) {
  // Filter out invalid badges and sort by priority
  const validBadges = React.useMemo(() => {
    if (!badges || !Array.isArray(badges)) return [];
    
    return badges
      .filter((badge) => badge && badge.type && badge.label)
      .map((badge) => ({
        ...badge,
        priority: badge.priority ?? getBadgeConfig(badge.type)?.priority ?? 100,
      }))
      .sort((a, b) => a.priority - b.priority)
      .slice(0, maxVisible);
  }, [badges, maxVisible]);

  // Render nothing if no valid badges
  if (validBadges.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center ${GAP_CLASSES[gap]} ${className}`}>
      {validBadges.map((badge, index) => (
        <Badge
          key={`${badge.type}-${index}`}
          type={badge.type}
          label={badge.label}
          variant={variant}
          size={size}
          showIcon={showIcon}
        />
      ))}
    </div>
  );
});

// Hero Badge Component - Airbnb style prominent badge
export interface HeroBadgeProps {
  badge?: BadgeData | null;
  rating?: number;
  reviewCount?: number;
  onClick?: () => void;
  className?: string;
}

export const HeroBadge = memo(function HeroBadge({
  badge,
  rating,
  reviewCount = 0,
  onClick,
  className = '',
}: HeroBadgeProps) {
  // Render nothing if no badge
  if (!badge || !badge.label) return null;

  const config = getBadgeConfig(badge.type);
  if (!config) return null;

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={`
        bg-white rounded-xl border border-gray-200 shadow-sm
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
        ${className}
      `}
    >
      <div className="flex items-center justify-between p-4 sm:p-5">
        {/* Left - Badge with Icon */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full ${config.bgColor}`}>
            <span className={config.color}>{config.icon}</span>
          </div>
          <div>
            <p className="text-sm sm:text-base font-semibold text-gray-900">
              {badge.label}
            </p>
            <p className="text-xs text-gray-500">
              One of the most loved homes on TripMe
            </p>
          </div>
        </div>

        {/* Right - Rating & Reviews */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-center">
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              {rating ? Number(rating).toFixed(1) : 'New'}
            </p>
            <div className="flex gap-[2px] justify-center mt-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-2.5 h-2.5 ${
                    s <= Math.round(rating || 0)
                      ? 'fill-gray-900 text-gray-900'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="w-px h-8 bg-gray-200" />

          <div className="text-center">
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              {reviewCount}
            </p>
            <p className="text-xs text-gray-500">Reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
});

// Simple Rating Strip - when no badge exists
export interface RatingStripProps {
  rating?: number;
  reviewCount?: number;
  onClick?: () => void;
  className?: string;
}

export const RatingStrip = memo(function RatingStrip({
  rating,
  reviewCount = 0,
  onClick,
  className = '',
}: RatingStripProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={`
        flex items-center gap-1.5
        ${onClick ? 'cursor-pointer hover:underline' : ''}
        ${className}
      `}
    >
      <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
      <span className="text-sm font-medium text-gray-900">
        {rating ? Number(rating).toFixed(2) : 'New'}
      </span>
      {reviewCount > 0 && (
        <>
          <span className="text-gray-400">·</span>
          <span className="text-sm text-gray-600 underline">
            {reviewCount} review{reviewCount !== 1 ? 's' : ''}
          </span>
        </>
      )}
    </div>
  );
});

// Card Badge - for listing cards (floating style)
export interface CardBadgeProps {
  type?: BadgeType | string;
  label?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export const CardBadge = memo(function CardBadge({
  type,
  label,
  position = 'top-left',
  className = '',
}: CardBadgeProps) {
  const config = type ? getBadgeConfig(type) : null;
  const displayLabel = label || config?.label;
  
  if (!displayLabel) return null;

  const positionClasses = {
    'top-left': 'top-3 left-3',
    'top-right': 'top-3 right-3',
    'bottom-left': 'bottom-3 left-3',
    'bottom-right': 'bottom-3 right-3',
  };

  return (
    <span
      className={`
        absolute ${positionClasses[position]} z-10
        inline-flex items-center gap-1
        text-[8px] md:text-xs font-semibold
        px-2.5 py-1 rounded-full
        bg-white/95 backdrop-blur-sm shadow-sm
        max-w-[calc(100%-4rem)]
        ${config?.color || 'text-gray-700'}
        ${className}
      `}
    >
      {config?.icon && <span className="hidden md:inline-flex flex-shrink-0 [&>svg]:w-3 [&>svg]:h-3">{config.icon}</span>}
      <span className="truncate">{displayLabel}</span>
    </span>
  );
});

// Utility: Extract badges from property data
export const extractBadgesFromProperty = (property: any): BadgeData[] => {
  const badges: BadgeData[] = [];

  // From admin badges
  if (property?.badges) {
    const { highlight = [], details = [], insights = [], urgency = [] } = property.badges;
    [...highlight, ...details, ...insights, ...urgency].forEach((b: any) => {
      if (b?.type && b?.label) {
        badges.push({ type: b.type, label: b.label, priority: b.priority });
      }
    });
  }

  // From adminBadges directly
  if (property?.adminBadges) {
    const { highlight = [], details = [], insights = [], urgency = [] } = property.adminBadges;
    [...highlight, ...details, ...insights, ...urgency].forEach((b: any) => {
      if (b?.type && b?.label) {
        badges.push({ type: b.type, label: b.label, priority: b.priority });
      }
    });
  }

  // From tags array
  if (Array.isArray(property?.tags)) {
    property.tags.forEach((tag: string) => {
      const config = getBadgeConfig(tag);
      if (config) {
        badges.push({ type: config.type, label: config.label, priority: config.priority });
      }
    });
  }

  // From boolean flags
  if (property?.isFeatured) {
    badges.push({ type: 'featured', label: 'Featured', priority: 51 });
  }
  if (property?.isSponsored) {
    badges.push({ type: 'sponsored', label: 'Sponsored', priority: 52 });
  }
  if (property?.host?.isSuperhost) {
    badges.push({ type: 'superhost', label: 'Superhost', priority: 2 });
  }
  if (property?.isTopRated) {
    badges.push({ type: 'top_rated', label: 'Top rated', priority: 4 });
  }

  // Deduplicate by type
  const seen = new Set<string>();
  return badges.filter((b) => {
    if (seen.has(b.type)) return false;
    seen.add(b.type);
    return true;
  });
};

// Get primary badge for card display
export const getPrimaryBadge = (property: any): BadgeData | null => {
  const badges = extractBadgesFromProperty(property);
  if (badges.length === 0) return null;
  
  // Sort by priority and return first
  return badges.sort((a, b) => (a.priority || 100) - (b.priority || 100))[0];
};

export default Badge;
