import { z } from 'zod';
import { 
  CardPanelPropsSchema, 
  CardItemSchema,
  CardFilterSchema 
} from './cardPanel.schema';

// Infer types from schemas
export type CardPanelProps = z.infer<typeof CardPanelPropsSchema>;
export type CardItem = z.infer<typeof CardItemSchema>;
export type CardFilter = z.infer<typeof CardFilterSchema>;

// Additional types not in schema
export interface CardPanelRef {
  scrollToCard: (cardId: string) => void;
  expandAllCards: () => void;
  collapseAllCards: () => void;
  selectCard: (cardId: string) => void;
  getSelectedCard: () => CardItem | null;
  exportCards: () => string;
  importCards: (data: string) => void;
}

// Event handler types
export type CardClickHandler = (cardId: string) => void;
export type CardToggleHandler = (cardId: string) => void;
export type CardEditHandler = (cardId: string, newCode: string) => void;
export type CardDeleteHandler = (cardId: string) => void;
export type CardSaveHandler = (cardId: string) => void;

// Card status types
export type CardStatus = 'success' | 'warning' | 'error';
export type CardType = 'function' | 'state' | 'effect' | 'class' | 'custom' | 'component';
export type MarkType = 'hash' | 'class' | 'idCard' | 'auto';

// Panel layout types
export interface PanelLayout {
  width: number;
  height: number;
  collapsed: boolean;
  position: 'left' | 'right' | 'bottom';
}

// Card metrics
export interface CardMetrics {
  linesOfCode: number;
  complexity: number;
  dependencies: number;
  dependents: number;
  lastModified: Date;
  performance: {
    renderTime: number;
    memoryUsage: number;
  };
}

// Drag and drop types
export interface DragItem {
  id: string;
  type: 'CARD';
  index: number;
}

export interface DropResult {
  dragIndex: number;
  dropIndex: number;
  dragId: string;
  dropId?: string;
}

// Search and filter types
export interface SearchOptions {
  caseSensitive: boolean;
  useRegex: boolean;
  searchInCode: boolean;
  searchInDescription: boolean;
}

export interface FilterOptions {
  type: CardType | 'all';
  status: CardStatus | 'all';
  tags: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  complexity?: {
    min: number;
    max: number;
  };
}

// Card grouping
export interface CardGroup {
  id: string;
  name: string;
  cards: CardItem[];
  collapsed: boolean;
  color?: string;
}

export type GroupBy = 'type' | 'status' | 'author' | 'date' | 'complexity' | 'none';

// Export/Import types
export interface ExportOptions {
  includeMetadata: boolean;
  format: 'json' | 'yaml' | 'markdown';
  compression: boolean;
}

export interface ImportResult {
  success: boolean;
  cardsImported: number;
  errors: string[];
  duplicates: string[];
}

// Card actions
export interface CardAction {
  id: string;
  label: string;
  icon?: string;
  onClick: (card: CardItem) => void;
  disabled?: (card: CardItem) => boolean;
  shortcut?: string;
}

// Panel state
export interface CardPanelState {
  selectedCardId?: string;
  expandedCards: Set<string>;
  collapsedGroups: Set<string>;
  searchQuery: string;
  filter: FilterOptions;
  sortBy: 'name' | 'type' | 'order' | 'status' | 'date';
  sortDirection: 'asc' | 'desc';
  viewMode: 'list' | 'grid' | 'compact';
  showMetrics: boolean;
  showDependencies: boolean;
}

// Theme customization
export interface CardTheme {
  background: string;
  foreground: string;
  border: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  shadow: string;
}

// Animation types
export interface AnimationConfig {
  duration: number;
  easing: string;
  stagger: number;
  disabled: boolean;
}

// Context menu types
export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  action: (card: CardItem) => void;
  separator?: boolean;
  disabled?: boolean;
  shortcut?: string;
}

// Keyboard shortcuts
export interface KeyboardShortcut {
  key: string;
  modifiers: ('ctrl' | 'alt' | 'shift' | 'meta')[];
  action: (card?: CardItem) => void;
  description: string;
  global?: boolean;
}