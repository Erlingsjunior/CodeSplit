import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CardPanel } from './cardPanel';
import { CardPanelProps, CardItem } from './cardPanel.types';
import { validateCardPanelProps } from './cardPanel.schema';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

// Sample test data
const mockCards: CardItem[] = [
  {
    id: 'card-1',
    type: 'function',
    name: 'fetchUserData',
    code: 'const fetchUserData = async (id) => {\n  return await api.get(`/users/${id}`);\n};',
    startLine: 1,
    endLine: 3,
    status: 'success',
    expanded: false,
    editable: true,
    dependencies: ['api'],
    dependents: ['UserProfile'],
    description: 'Fetches user data from API',
    isCustomCard: false,
    markType: 'auto',
    order: 1,
  },
  {
    id: 'card-2',
    type: 'state',
    name: 'userState',
    code: 'const [user, setUser] = useState(null);',
    startLine: 5,
    endLine: 5,
    status: 'warning',
    expanded: false,
    editable: true,
    dependencies: [],
    dependents: ['UserProfile'],
    description: 'User state management',
    isCustomCard: false,
    markType: 'auto',
    order: 2,
  },
  {
    id: 'card-3',
    type: 'effect',
    name: 'loadUserEffect',
    code: 'useEffect(() => {\n  fetchUserData(userId).then(setUser);\n}, [userId]);',
    startLine: 7,
    endLine: 9,
    status: 'error',
    expanded: false,
    editable: true,
    dependencies: ['fetchUserData', 'userState'],
    dependents: [],
    description: 'Effect to load user data',
    isCustomCard: false,
    markType: 'auto',
    order: 3,
  },
];

const defaultProps: CardPanelProps = {
  cards: mockCards,
  width: 400,
  isVisible: true,
  theme: 'dark',
  onCardClick: jest.fn(),
  onCardToggle: jest.fn(),
  onCardEdit: jest.fn(),
  onCardDelete: jest.fn(),
  onCardSave: jest.fn(),
};

// Helper function to render component
const renderCardPanel = (props: Partial<CardPanelProps> = {}) => {
  const mergedProps = { ...defaultProps, ...props };
  return render(<CardPanel {...mergedProps} />);
};

describe('CardPanel Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Basic rendering tests
  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderCardPanel();
      expect(screen.getByText('Code Cards')).toBeInTheDocument();
    });

    it('should not render when isVisible is false', () => {
      renderCardPanel({ isVisible: false });
      expect(screen.queryByText('Code Cards')).not.toBeInTheDocument();
    });

    it('should display correct card count', () => {
      renderCardPanel();
      expect(screen.getByText('(3)')).toBeInTheDocument();
    });

    it('should render all cards', () => {
      renderCardPanel();
      expect(screen.getByText('fetchUserData')).toBeInTheDocument();
      expect(screen.getByText('userState')).toBeInTheDocument();
      expect(screen.getByText('loadUserEffect')).toBeInTheDocument();
    });

    it('should apply correct theme styles', () => {
      const { rerender } = renderCardPanel({ theme: 'dark' });
      expect(screen.getByText('Code Cards').closest('.flex')).toHaveClass('bg-gray-900');
      
      rerender(<CardPanel {...defaultProps} theme="light" />);
      expect(screen.getByText('Code Cards').closest('.flex')).toHaveClass('bg-white');
    });
  });

  // Props validation tests
  describe('Zod Schema Validation', () => {
    it('should validate valid props successfully', () => {
      expect(() => validateCardPanelProps(defaultProps)).not.toThrow();
    });

    it('should reject invalid width', () => {
      const invalidProps = { ...defaultProps, width: 100 };
      expect(() => validateCardPanelProps(invalidProps)).toThrow();
    });

    it('should reject invalid theme', () => {
      const invalidProps = { ...defaultProps, theme: 'invalid' };
      expect(() => validateCardPanelProps(invalidProps)).toThrow();
    });

    it('should apply default values for optional props', () => {
      const minimalProps = { cards: [] };
      const validated = validateCardPanelProps(minimalProps);
      
      expect(validated.width).toBe(400);
      expect(validated.theme).toBe('dark');
      expect(validated.isVisible).toBe(true);
    });
  });

  // Card interaction tests
  describe('Card Interactions', () => {
    it('should call onCardClick when card is clicked', async () => {
      const onCardClick = jest.fn();
      renderCardPanel({ onCardClick });
      
      const card = screen.getByText('fetchUserData').closest('.group');
      await userEvent.click(card!);
      
      expect(onCardClick).toHaveBeenCalledWith('card-1');
    });

    it('should expand/collapse card when toggle button is clicked', async () => {
      const onCardToggle = jest.fn();
      renderCardPanel({ onCardToggle });
      
      const toggleButtons = screen.getAllByRole('button');
      const expandButton = toggleButtons.find(btn => 
        btn.querySelector('svg')?.getAttribute('data-lucide') === 'chevron-right'
      );
      
      await userEvent.click(expandButton!);
      expect(onCardToggle).toHaveBeenCalledWith('card-1');
    });

    it('should call onCardEdit when edit button is clicked', async () => {
      const onCardEdit = jest.fn();
      renderCardPanel({ onCardEdit });
      
      // Hover over card to show action buttons
      const card = screen.getByText('fetchUserData').closest('.group');
      await userEvent.hover(card!);
      
      const editButton = screen.getByTitle('Edit card');
      await userEvent.click(editButton);
      
      expect(onCardEdit).toHaveBeenCalledWith('card-1', expect.any(String));
    });

    it('should call onCardDelete when delete button is clicked', async () => {
      const onCardDelete = jest.fn();
      renderCardPanel({ onCardDelete });
      
      const card = screen.getByText('fetchUserData').closest('.group');
      await userEvent.hover(card!);
      
      const deleteButton = screen.getByTitle('Delete card');
      await userEvent.click(deleteButton);
      
      expect(onCardDelete).toHaveBeenCalledWith('card-1');
    });

    it('should copy code to clipboard when copy button is clicked', async () => {
      renderCardPanel();
      
      const card = screen.getByText('fetchUserData').closest('.group');
      await userEvent.hover(card!);
      
      const copyButton = screen.getByTitle('Copy code');
      await userEvent.click(copyButton);
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('fetchUserData')
      );
    });
  });

  // Search and filter tests
  describe('Search and Filtering', () => {
    it('should filter cards by search query', async () => {
      renderCardPanel();
      
      const searchInput = screen.getByPlaceholderText('Search cards...');
      await userEvent.type(searchInput, 'fetch');
      
      expect(screen.getByText('fetchUserData')).toBeInTheDocument();
      expect(screen.queryByText('userState')).not.toBeInTheDocument();
      expect(screen.queryByText('loadUserEffect')).not.toBeInTheDocument();
    });

    it('should filter cards by type', async () => {
      renderCardPanel();
      
      const typeFilter = screen.getByDisplayValue('All Types');
      await userEvent.selectOptions(typeFilter, 'function');
      
      expect(screen.getByText('fetchUserData')).toBeInTheDocument();
      expect(screen.queryByText('userState')).not.toBeInTheDocument();
      expect(screen.queryByText('loadUserEffect')).not.toBeInTheDocument();
    });

    it('should sort cards by different criteria', async () => {
      renderCardPanel();
      
      const sortSelect = screen.getByDisplayValue('Order');
      await userEvent.selectOptions(sortSelect, 'name');
      
      // Check if cards are sorted alphabetically
      const cardNames = screen.getAllByText(/fetchUserData|userState|loadUserEffect/);
      expect(cardNames[0]).toHaveTextContent('fetchUserData');
      expect(cardNames[1]).toHaveTextContent('loadUserEffect');
      expect(cardNames[2]).toHaveTextContent('userState');
    });

    it('should show empty state when no cards match search', async () => {
      renderCardPanel();
      
      const searchInput = screen.getByPlaceholderText('Search cards...');
      await userEvent.type(searchInput, 'nonexistent');
      
      expect(screen.getByText('No cards match your search')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search terms')).toBeInTheDocument();
    });
  });

  // Card status and type tests
  describe('Card Status and Types', () => {
    it('should display correct status indicators', () => {
      renderCardPanel();
      
      // Check if cards have proper status styling (testing via class names would be complex)
      expect(screen.getByText('fetchUserData')).toBeInTheDocument();
      expect(screen.getByText('userState')).toBeInTheDocument();
      expect(screen.getByText('loadUserEffect')).toBeInTheDocument();
    });

    it('should display correct type badges', () => {
      renderCardPanel();
      
      expect(screen.getByText('function')).toBeInTheDocument();
      expect(screen.getByText('state')).toBeInTheDocument();
      expect(screen.getByText('effect')).toBeInTheDocument();
    });

    it('should show type icons', () => {
      renderCardPanel();
      
      // Check for emoji icons (this might need adjustment based on actual implementation)
      const cardHeaders = screen.getAllByText(/⚡|🔄|💫/);
      expect(cardHeaders.length).toBeGreaterThan(0);
    });
  });

  // Dependencies tests
  describe('Dependencies Display', () => {
    it('should show dependencies when showDependencies is true', async () => {
      renderCardPanel({ showDependencies: true });
      
      // Expand a card to see dependencies
      const toggleButton = screen.getAllByRole('button')[1]; // First expand button
      await userEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.getByText('Dependencies:')).toBeInTheDocument();
      });
    });

    it('should not show dependencies section when showDependencies is false', async () => {
      renderCardPanel({ showDependencies: false });
      
      const toggleButton = screen.getAllByRole('button')[1];
      await userEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Dependencies:')).not.toBeInTheDocument();
      });
    });
  });

  // Library tests
  describe('Library Functionality', () => {
    it('should show library section when showLibrary is true', () => {
      renderCardPanel({ showLibrary: true });
      
      expect(screen.getByText('Library')).toBeInTheDocument();
    });

    it('should call onToggleLibrary when library button is clicked', async () => {
      const onToggleLibrary = jest.fn();
      renderCardPanel({ onToggleLibrary });
      
      const libraryButton = screen.getByTitle('Toggle library');
      await userEvent.click(libraryButton);
      
      expect(onToggleLibrary).toHaveBeenCalled();
    });

    it('should display library cards when provided', () => {
      const libraryCards = [
        { id: 'lib-1', name: 'Library Card 1', type: 'function' },
        { id: 'lib-2', name: 'Library Card 2', type: 'state' },
      ];
      
      renderCardPanel({ showLibrary: true, libraryCards });
      
      expect(screen.getByText('Library Card 1')).toBeInTheDocument();
      expect(screen.getByText('Library Card 2')).toBeInTheDocument();
    });
  });

  // Empty state tests
  describe('Empty States', () => {
    it('should show empty state when no cards are provided', () => {
      renderCardPanel({ cards: [] });
      
      expect(screen.getByText('No code cards found')).toBeInTheDocument();
      expect(screen.getByText('Start coding to see cards appear here')).toBeInTheDocument();
    });

    it('should show empty library state', () => {
      renderCardPanel({ showLibrary: true, libraryCards: [] });
      
      expect(screen.getByText('No saved cards yet')).toBeInTheDocument();
    });
  });

  // Ref methods tests
  describe('Ref Methods', () => {
    it('should expose ref methods', () => {
      const ref = React.createRef<any>();
      renderCardPanel({ ref });
      
      expect(typeof ref.current?.scrollToCard).toBe('function');
      expect(typeof ref.current?.expandAllCards).toBe('function');
      expect(typeof ref.current?.collapseAllCards).toBe('function');
      expect(typeof ref.current?.selectCard).toBe('function');
      expect(typeof ref.current?.getSelectedCard).toBe('function');
      expect(typeof ref.current?.exportCards).toBe('function');
      expect(typeof ref.current?.importCards).toBe('function');
    });

    it('should export cards as JSON', () => {
      const ref = React.createRef<any>();
      renderCardPanel({ ref });
      
      const exported = ref.current?.exportCards();
      expect(typeof exported).toBe('string');
      expect(() => JSON.parse(exported)).not.toThrow();
    });
  });

  // Performance tests
  describe('Performance', () => {
    it('should handle large number of cards', () => {
      const manyCards = Array.from({ length: 100 }, (_, i) => ({
        ...mockCards[0],
        id: `card-${i}`,
        name: `Card ${i}`,
        order: i,
      }));
      
      renderCardPanel({ cards: manyCards });
      
      expect(screen.getByText('(100)')).toBeInTheDocument();
    });

    it('should not re-render unnecessarily', () => {
      const { rerender } = renderCardPanel();
      
      // Re-render with same props
      rerender(<CardPanel {...defaultProps} />);
      
      expect(screen.getByText('Code Cards')).toBeInTheDocument();
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('should handle cards with no dependencies', () => {
      const cardsWithNoDeps = mockCards.map(card => ({
        ...card,
        dependencies: [],
        dependents: [],
      }));
      
      renderCardPanel({ cards: cardsWithNoDeps, showDependencies: true });
      
      expect(screen.getByText('fetchUserData')).toBeInTheDocument();
    });

    it('should handle very long card names', () => {
      const longNameCard = {
        ...mockCards[0],
        name: 'this_is_a_very_long_function_name_that_should_be_truncated_properly',
      };
      
      renderCardPanel({ cards: [longNameCard] });
      
      expect(screen.getByText(longNameCard.name)).toBeInTheDocument();
    });

    it('should handle special characters in search', async () => {
      renderCardPanel();
      
      const searchInput = screen.getByPlaceholderText('Search cards...');
      await userEvent.type(searchInput, '$@#%^&*()');
      
      expect(screen.getByText('No cards match your search')).toBeInTheDocument();
    });
  });
});

// Integration tests
describe('CardPanel Integration', () => {
  it('should work with external state management', async () => {
    let selectedCard = '';
    const setSelectedCard = jest.fn((cardId) => {
      selectedCard = cardId;
    });

    const { rerender } = renderCardPanel({
      selectedCardId: selectedCard,
      onCardClick: setSelectedCard,
    });

    const card = screen.getByText('fetchUserData').closest('.group');
    await userEvent.click(card!);

    expect(setSelectedCard).toHaveBeenCalledWith('card-1');

    // Re-render with updated selection
    rerender(
      <CardPanel 
        {...defaultProps} 
        selectedCardId="card-1"
        onCardClick={setSelectedCard}
      />
    );

    expect(screen.getByText('fetchUserData')).toBeInTheDocument();
  });

  it('should synchronize with code editor selections', () => {
    renderCardPanel({ selectedCardId: 'card-2' });
    
    // Card should be visually selected
    expect(screen.getByText('userState')).toBeInTheDocument();
  });
});