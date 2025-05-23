'use client';

import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  Save, 
  Copy,
  Play,
  Bug,
  Book,
  Grid,
  List,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardPanelProps, CardPanelRef, CardItem, CardPanelState } from './cardPanel.types';
import { validateCardPanelProps } from './cardPanel.schema';
import { 
  useCardPanelStyles, 
  getCardTypeIcon, 
  cardAnimationVariants,
  panelAnimationVariants 
} from './cardPanel.styles';

export const CardPanel = forwardRef<CardPanelRef, CardPanelProps>((props, ref) => {
  // Validate props with Zod
  const validatedProps = validateCardPanelProps(props);
  
  const {
    cards = [],
    width = 400,
    isVisible = true,
    theme = 'dark',
    selectedCardId,
    highlightedCardId,
    onCardClick,
    onCardToggle,
    onCardEdit,
    onCardDelete,
    onCardSave,
    showLibrary = false,
    libraryCards = [],
    onToggleLibrary,
    filterType = 'all',
    sortBy = 'order',
    searchQuery = '',
    showDependencies = false,
    showDataFlow = false,
    collapsible = true,
    resizable = true,
    dragAndDrop = true,
  } = validatedProps;

  const styles = useCardPanelStyles({ theme, width });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Internal state
  const [panelState, setPanelState] = useState<CardPanelState>({
    selectedCardId,
    expandedCards: new Set<string>(),
    collapsedGroups: new Set<string>(),
    searchQuery,
    filter: {
      type: filterType,
      status: 'all',
      tags: [],
    },
    sortBy,
    sortDirection: 'asc',
    viewMode: 'list',
    showMetrics: false,
    showDependencies,
  });

  // Filtered and sorted cards
  const filteredCards = React.useMemo(() => {
    let filtered = cards.filter(card => {
      // Type filter
      if (panelState.filter.type !== 'all' && card.type !== panelState.filter.type) {
        return false;
      }
      
      // Status filter
      if (panelState.filter.status !== 'all' && card.status !== panelState.filter.status) {
        return false;
      }
      
      // Search filter
      if (panelState.searchQuery) {
        const query = panelState.searchQuery.toLowerCase();
        return (
          card.name.toLowerCase().includes(query) ||
          card.description.toLowerCase().includes(query) ||
          card.code.toLowerCase().includes(query)
        );
      }
      
      return true;
    });

    // Sort cards
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (panelState.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'order':
        default:
          comparison = (a.order || 0) - (b.order || 0);
          break;
      }
      
      return panelState.sortDirection === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [cards, panelState.filter, panelState.searchQuery, panelState.sortBy, panelState.sortDirection]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    scrollToCard: (cardId: string) => {
      const cardElement = containerRef.current?.querySelector(`[data-card-id="${cardId}"]`);
      cardElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    
    expandAllCards: () => {
      setPanelState(prev => ({
        ...prev,
        expandedCards: new Set(cards.map(card => card.id))
      }));
    },
    
    collapseAllCards: () => {
      setPanelState(prev => ({
        ...prev,
        expandedCards: new Set()
      }));
    },
    
    selectCard: (cardId: string) => {
      setPanelState(prev => ({ ...prev, selectedCardId: cardId }));
      onCardClick?.(cardId);
    },
    
    getSelectedCard: () => {
      return cards.find(card => card.id === panelState.selectedCardId) || null;
    },
    
    exportCards: () => {
      return JSON.stringify(cards, null, 2);
    },
    
    importCards: (data: string) => {
      try {
        const importedCards = JSON.parse(data);
        // Handle import logic here
        console.log('Cards imported:', importedCards);
      } catch (error) {
        console.error('Failed to import cards:', error);
      }
    },
  }), [cards, panelState.selectedCardId, onCardClick]);

  // Handle card click
  const handleCardClick = (card: CardItem) => {
    setPanelState(prev => ({ ...prev, selectedCardId: card.id }));
    onCardClick?.(card.id);
  };

  // Handle card expansion toggle
  const handleCardToggle = (cardId: string) => {
    setPanelState(prev => {
      const newExpanded = new Set(prev.expandedCards);
      if (newExpanded.has(cardId)) {
        newExpanded.delete(cardId);
      } else {
        newExpanded.add(cardId);
      }
      return { ...prev, expandedCards: newExpanded };
    });
    onCardToggle?.(cardId);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setPanelState(prev => ({ ...prev, searchQuery: query }));
  };

  // Handle filter change
  const handleFilterChange = (filterType: string) => {
    setPanelState(prev => ({
      ...prev,
      filter: { ...prev.filter, type: filterType as any }
    }));
  };

  // Render individual card
  const renderCard = (card: CardItem) => {
    const isSelected = card.id === panelState.selectedCardId;
    const isExpanded = panelState.expandedCards.has(card.id);
    const isHighlighted = card.id === highlightedCardId;

    return (
      <motion.div
        key={card.id}
        data-card-id={card.id}
        variants={cardAnimationVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`group ${styles.card(card.status, isSelected, isExpanded)}`}
        onClick={() => handleCardClick(card)}
      >
        {/* Card Header */}
        <div className={styles.cardHeader}>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardToggle(card.id);
              }}
              className="p-1 hover:bg-black/10 rounded transition-colors"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            <span className="text-lg">{getCardTypeIcon(card.type)}</span>
            
            <div className="flex-1 min-w-0">
              <div className={styles.cardTitle(card.type)}>
                <span className="truncate">{card.name}</span>
              </div>
              <div className="text-xs opacity-60 truncate">
                {card.description}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <span className={styles.cardBadge(card.type)}>
              {card.type}
            </span>
            
            <div className={styles.cardActions}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCardEdit?.(card.id, card.code);
                }}
                className={styles.actionButton}
                title="Edit card"
              >
                <Edit3 size={14} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCardSave?.(card.id);
                }}
                className={styles.actionButton}
                title="Save to library"
              >
                <Save size={14} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Copy code to clipboard
                  navigator.clipboard.writeText(card.code);
                }}
                className={styles.actionButton}
                title="Copy code"
              >
                <Copy size={14} />
              </button>
              
              {card.editable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCardDelete?.(card.id);
                  }}
                  className={`${styles.actionButton} text-red-400 hover:text-red-300`}
                  title="Delete card"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Card Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={styles.cardContent}
            >
              <div className={styles.codeBlock}>
                <pre className="text-xs overflow-x-auto">
                  <code>{card.code}</code>
                </pre>
              </div>
              
              {/* Dependencies */}
              {showDependencies && (card.dependencies.length > 0 || card.dependents.length > 0) && (
                <div className={styles.dependenciesSection}>
                  {card.dependencies.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs font-medium mb-1">Dependencies:</div>
                      {card.dependencies.map(dep => (
                        <span key={dep} className={styles.dependencyTag}>
                          {dep}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {card.dependents.length > 0 && (
                    <div>
                      <div className="text-xs font-medium mb-1">Used by:</div>
                      {card.dependents.map(dep => (
                        <span key={dep} className={styles.dependencyTag}>
                          {dep}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Metadata */}
              <div className="mt-2 flex items-center justify-between text-xs opacity-60">
                <span>Lines: {card.startLine}-{card.endLine}</span>
                {card.order && <span>Order: {card.order}</span>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <motion.div
      ref={containerRef}
      variants={panelAnimationVariants}
      initial="closed"
      animate="open"
      exit="closed"
      className={styles.panel}
      style={{ width }}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.title}>
          <Grid size={18} />
          <span>Code Cards</span>
          <span className="text-xs opacity-60">({filteredCards.length})</span>
        </div>
        
        <div className="flex items-center gap-2">
          {onToggleLibrary && (
            <button
              onClick={onToggleLibrary}
              className={`p-1 rounded transition-colors ${
                showLibrary 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'hover:bg-black/10'
              }`}
              title="Toggle library"
            >
              <Book size={16} />
            </button>
          )}
          
          <button
            onClick={() => setPanelState(prev => ({
              ...prev,
              viewMode: prev.viewMode === 'list' ? 'grid' : 'list'
            }))}
            className="p-1 rounded hover:bg-black/10 transition-colors"
            title="Toggle view mode"
          >
            {panelState.viewMode === 'list' ? <Grid size={16} /> : <List size={16} />}
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className={styles.searchContainer}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search cards..."
            value={panelState.searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className={`${styles.searchInput} pl-10`}
          />
        </div>
        
        <div className={styles.filterRow}>
          <select
            value={panelState.filter.type}
            onChange={(e) => handleFilterChange(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Types</option>
            <option value="function">Functions</option>
            <option value="state">States</option>
            <option value="effect">Effects</option>
            <option value="custom">Custom</option>
            <option value="component">Components</option>
          </select>
          
          <select
            value={panelState.sortBy}
            onChange={(e) => setPanelState(prev => ({ 
              ...prev, 
              sortBy: e.target.value as any 
            }))}
            className={styles.filterSelect}
          >
            <option value="order">Order</option>
            <option value="name">Name</option>
            <option value="type">Type</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>
      
      {/* Cards Container */}
      <div className={styles.cardsContainer}>
        {filteredCards.length > 0 ? (
          <div className={styles.cardsList}>
            <AnimatePresence>
              {filteredCards.map(renderCard)}
            </AnimatePresence>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📦</div>
            <div className={styles.emptyText}>
              {panelState.searchQuery 
                ? 'No cards match your search'
                : 'No code cards found'
              }
            </div>
            <div className={styles.emptySubtext}>
              {panelState.searchQuery 
                ? 'Try adjusting your search terms'
                : 'Start coding to see cards appear here'
              }
            </div>
          </div>
        )}
      </div>
      
      {/* Library Section */}
      {showLibrary && (
        <div className={styles.librarySection}>
          <div className={styles.libraryHeader}>
            <div className="flex items-center gap-2">
              <Book size={16} />
              <span className="font-medium">Library</span>
              <span className="text-xs opacity-60">({libraryCards.length})</span>
            </div>
          </div>
          
          <div className="p-2 max-h-40 overflow-y-auto">
            {libraryCards.length > 0 ? (
              <div className="space-y-1">
                {libraryCards.map((card: any) => (
                  <div
                    key={card.id}
                    className="p-2 rounded border border-gray-600 hover:bg-gray-700/50 cursor-pointer text-xs"
                    onClick={() => {
                      // Handle library card click
                      console.log('Library card clicked:', card);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{card.name}</span>
                      <span className="text-xs opacity-60">{card.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-xs opacity-60 py-4">
                No saved cards yet
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
});

CardPanel.displayName = 'CardPanel';

export default CardPanel;