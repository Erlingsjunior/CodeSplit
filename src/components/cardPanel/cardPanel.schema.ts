import { z } from 'zod';

export const CardPanelPropsSchema = z.object({
  // Cards data
  cards: z.array(z.object({
    id: z.string(),
    type: z.enum(['function', 'state', 'effect', 'class', 'custom', 'component']),
    name: z.string(),
    code: z.string(),
    startLine: z.number(),
    endLine: z.number(),
    status: z.enum(['success', 'warning', 'error']),
    expanded: z.boolean(),
    editable: z.boolean(),
    dependencies: z.array(z.string()),
    dependents: z.array(z.string()),
    description: z.string(),
    isCustomCard: z.boolean(),
    markType: z.enum(['hash', 'class', 'idCard', 'auto']),
    order: z.number().optional(),
  })),
  
  // Panel configuration
  width: z.number().min(200).max(800).default(400),
  isVisible: z.boolean().default(true),
  theme: z.enum(['dark', 'light']).default('dark'),
  
  // Selected state
  selectedCardId: z.string().optional(),
  highlightedCardId: z.string().optional(),
  
  // Event handlers
  onCardClick: z.function(z.tuple([z.string()]), z.void()).optional(),
  onCardToggle: z.function(z.tuple([z.string()]), z.void()).optional(),
  onCardEdit: z.function(z.tuple([z.string(), z.string()]), z.void()).optional(),
  onCardDelete: z.function(z.tuple([z.string()]), z.void()).optional(),
  onCardSave: z.function(z.tuple([z.string()]), z.void()).optional(),
  
  // Library features
  showLibrary: z.boolean().default(false),
  libraryCards: z.array(z.any()).default([]),
  onToggleLibrary: z.function(z.tuple([]), z.void()).optional(),
  
  // Filtering and sorting
  filterType: z.enum(['all', 'function', 'state', 'effect', 'custom']).default('all'),
  sortBy: z.enum(['name', 'type', 'order', 'status']).default('order'),
  searchQuery: z.string().default(''),
  
  // Analysis features
  showDependencies: z.boolean().default(false),
  showDataFlow: z.boolean().default(false),
  
  // Panel behavior
  collapsible: z.boolean().default(true),
  resizable: z.boolean().default(true),
  dragAndDrop: z.boolean().default(true),
});

export const CardItemSchema = z.object({
  id: z.string(),
  type: z.enum(['function', 'state', 'effect', 'class', 'custom', 'component']),
  name: z.string().min(1, 'Card name is required'),
  code: z.string(),
  startLine: z.number().min(1),
  endLine: z.number().min(1),
  status: z.enum(['success', 'warning', 'error']),
  expanded: z.boolean(),
  editable: z.boolean(),
  dependencies: z.array(z.string()),
  dependents: z.array(z.string()),
  description: z.string(),
  isCustomCard: z.boolean(),
  markType: z.enum(['hash', 'class', 'idCard', 'auto']),
  order: z.number().optional(),
  
  // Additional metadata
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).default([]),
  
  // Performance metrics
  complexity: z.number().min(0).max(10).optional(),
  coverage: z.number().min(0).max(100).optional(),
});

export const CardFilterSchema = z.object({
  type: z.enum(['all', 'function', 'state', 'effect', 'custom']),
  status: z.enum(['all', 'success', 'warning', 'error']).optional(),
  searchQuery: z.string(),
  tags: z.array(z.string()).default([]),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
});

// Validation functions
export const validateCardPanelProps = (props: unknown) => {
  return CardPanelPropsSchema.parse(props);
};

export const validateCardItem = (card: unknown) => {
  return CardItemSchema.parse(card);
};

export const validateCardFilter = (filter: unknown) => {
  return CardFilterSchema.parse(filter);
};

// Custom validation rules
export const CardBusinessRules = {
  validateCardName: (name: string): boolean => {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
  },
  
  validateCodeIntegrity: (code: string): boolean => {
    // Check for balanced brackets, quotes, etc.
    const brackets = { '(': ')', '[': ']', '{': '}' };
    const stack: string[] = [];
    
    for (const char of code) {
      if (char in brackets) {
        stack.push(brackets[char as keyof typeof brackets]);
      } else if (Object.values(brackets).includes(char)) {
        if (stack.pop() !== char) return false;
      }
    }
    
    return stack.length === 0;
  },
  
  validateDependencies: (card: any, allCards: any[]): string[] => {
    const errors: string[] = [];
    
    // Check if dependencies exist
    card.dependencies.forEach((depId: string) => {
      if (!allCards.find(c => c.id === depId)) {
        errors.push(`Dependency ${depId} not found`);
      }
    });
    
    // Check for circular dependencies
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    const hasCycle = (cardId: string): boolean => {
      if (recursionStack.has(cardId)) return true;
      if (visited.has(cardId)) return false;
      
      visited.add(cardId);
      recursionStack.add(cardId);
      
      const currentCard = allCards.find(c => c.id === cardId);
      if (currentCard) {
        for (const depId of currentCard.dependencies) {
          if (hasCycle(depId)) return true;
        }
      }
      
      recursionStack.delete(cardId);
      return false;
    };
    
    if (hasCycle(card.id)) {
      errors.push('Circular dependency detected');
    }
    
    return errors;
  },
};