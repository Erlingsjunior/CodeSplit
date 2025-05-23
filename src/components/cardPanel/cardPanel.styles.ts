import { useMemo } from 'react';
import { CardPanelProps, CardItem, CardStatus, CardType } from './cardPanel.types';

export const useCardPanelStyles = (props: Pick<CardPanelProps, 'theme' | 'width'>) => {
  return useMemo(() => {
    const { theme, width } = props;
    const isDark = theme === 'dark';
    
    return {
      // Panel container
      panel: `
        flex flex-col h-full border-l transition-all duration-300 ease-in-out
        ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}
        ${width < 300 ? 'text-xs' : 'text-sm'}
      `,
      
      // Panel header
      header: `
        flex items-center justify-between p-3 border-b flex-shrink-0
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}
      `,
      
      title: `
        font-semibold flex items-center gap-2
        ${isDark ? 'text-gray-200' : 'text-gray-800'}
      `,
      
      // Search and filters
      searchContainer: `
        p-3 border-b space-y-2
        ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50/50 border-gray-300'}
      `,
      
      searchInput: `
        w-full px-3 py-2 rounded-md border text-sm transition-colors
        ${isDark 
          ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500' 
          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500/20
      `,
      
      filterRow: `
        flex gap-2 items-center justify-between
      `,
      
      filterSelect: `
        px-2 py-1 rounded text-xs border transition-colors
        ${isDark 
          ? 'bg-gray-700 border-gray-600 text-gray-200' 
          : 'bg-white border-gray-300 text-gray-700'
        }
      `,
      
      // Cards container
      cardsContainer: `
        flex-1 overflow-y-auto overflow-x-hidden
        scrollbar-thin scrollbar-track-transparent
        ${isDark ? 'scrollbar-thumb-gray-600' : 'scrollbar-thumb-gray-400'}
      `,
      
      cardsList: `
        p-2 space-y-2
      `,
      
      // Individual card styles
      card: (status: CardStatus, isSelected: boolean, isExpanded: boolean) => `
        border rounded-lg transition-all duration-200 cursor-pointer
        hover:shadow-md active:scale-[0.995]
        ${getCardStatusStyles(status, isDark)}
        ${isSelected ? getSelectedCardStyles(isDark) : ''}
        ${isExpanded ? 'ring-1 ring-blue-500/30' : ''}
      `,
      
      cardHeader: `
        flex items-center justify-between p-3
      `,
      
      cardTitle: (type: CardType) => `
        flex items-center gap-2 font-medium truncate
        ${getCardTypeColor(type, isDark)}
      `,
      
      cardBadge: (type: CardType) => `
        px-2 py-1 text-xs rounded-full font-medium
        ${getCardTypeBadgeStyles(type, isDark)}
      `,
      
      cardActions: `
        flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity
      `,
      
      actionButton: `
        p-1 rounded hover:bg-black/10 transition-colors
        ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}
      `,
      
      // Card content
      cardContent: `
        px-3 pb-3 border-t
        ${isDark ? 'border-gray-700' : 'border-gray-200'}
      `,
      
      codeBlock: `
        bg-black/20 rounded p-2 mt-2 font-mono text-xs overflow-x-auto
        ${isDark ? 'bg-black/30' : 'bg-gray-100'}
      `,
      
      // Dependencies
      dependenciesSection: `
        mt-2 p-2 rounded border
        ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}
      `,
      
      dependencyTag: `
        inline-block px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-400 mr-1 mb-1
      `,
      
      // Library section
      librarySection: `
        border-t
        ${isDark ? 'border-gray-700' : 'border-gray-300'}
      `,
      
      libraryHeader: `
        p-3 flex items-center justify-between
        ${isDark ? 'bg-gray-800/30' : 'bg-gray-50/30'}
      `,
      
      // Empty states
      emptyState: `
        flex flex-col items-center justify-center p-8 text-center
        ${isDark ? 'text-gray-400' : 'text-gray-500'}
      `,
      
      emptyIcon: `
        w-12 h-12 mb-4 opacity-50
      `,
      
      emptyText: `
        text-sm mb-2
      `,
      
      emptySubtext: `
        text-xs opacity-75
      `,
      
      // Loading states
      loadingCard: `
        animate-pulse border rounded-lg p-3
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'}
      `,
      
      loadingLine: (width: string) => `
        h-3 rounded mb-2
        ${isDark ? 'bg-gray-700' : 'bg-gray-300'}
        ${width}
      `,
    };
  }, [props.theme, props.width]);
};

// Helper functions for dynamic styles
const getCardStatusStyles = (status: CardStatus, isDark: boolean): string => {
  const baseStyles = isDark 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';
    
  switch (status) {
    case 'success':
      return `${baseStyles} border-l-4 border-l-green-500`;
    case 'warning':
      return `${baseStyles} border-l-4 border-l-yellow-500`;
    case 'error':
      return `${baseStyles} border-l-4 border-l-red-500`;
    default:
      return baseStyles;
  }
};

const getSelectedCardStyles = (isDark: boolean): string => {
  return isDark 
    ? 'ring-2 ring-blue-500/50 bg-blue-900/20' 
    : 'ring-2 ring-blue-500/50 bg-blue-50';
};

const getCardTypeColor = (type: CardType, isDark: boolean): string => {
  const colors = {
    function: isDark ? 'text-blue-400' : 'text-blue-600',
    state: isDark ? 'text-green-400' : 'text-green-600',
    effect: isDark ? 'text-purple-400' : 'text-purple-600',
    class: isDark ? 'text-orange-400' : 'text-orange-600',
    custom: isDark ? 'text-pink-400' : 'text-pink-600',
    component: isDark ? 'text-indigo-400' : 'text-indigo-600',
  };
  
  return colors[type] || (isDark ? 'text-gray-400' : 'text-gray-600');
};

const getCardTypeBadgeStyles = (type: CardType, isDark: boolean): string => {
  const styles = {
    function: 'bg-blue-500/20 text-blue-400',
    state: 'bg-green-500/20 text-green-400',
    effect: 'bg-purple-500/20 text-purple-400',
    class: 'bg-orange-500/20 text-orange-400',
    custom: 'bg-pink-500/20 text-pink-400',
    component: 'bg-indigo-500/20 text-indigo-400',
  };
  
  return styles[type] || (isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-500/20 text-gray-600');
};

// Icon mapping for card types
export const getCardTypeIcon = (type: CardType): string => {
  const icons = {
    function: '⚡',
    state: '🔄',
    effect: '💫',
    class: '🏗️',
    custom: '🎨',
    component: '⚛️',
  };
  
  return icons[type] || '📦';
};

// Animation variants for framer-motion
export const cardAnimationVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.15
    }
  }
};

export const panelAnimationVariants = {
  closed: { 
    width: 0,
    opacity: 0 
  },
  open: { 
    width: 'auto',
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// CSS-in-JS styles for complex animations
export const cardPanelCSSStyles = {
  '@keyframes cardPulse': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.7 }
  },
  
  '.card-analyzing': {
    animation: 'cardPulse 1.5s ease-in-out infinite'
  },
  
  '.card-drag-over': {
    transform: 'scale(1.02)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.2s ease'
  },
  
  '.scrollbar-thin': {
    '&::-webkit-scrollbar': {
      width: '6px'
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent'
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '3px'
    }
  }
};