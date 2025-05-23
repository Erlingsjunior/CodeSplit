import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { CardPanel } from './cardPanel';
import { CardPanelProps, CardItem } from './cardPanel.types';

// Sample card data for stories
const sampleCards: CardItem[] = [
  {
    id: 'card-1',
    type: 'function',
    name: 'fetchUserData',
    code: `const fetchUserData = async (userId: string): Promise<User> => {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};`,
    startLine: 1,
    endLine: 10,
    status: 'success',
    expanded: false,
    editable: true,
    dependencies: ['fetch'],
    dependents: ['UserProfile', 'UserDashboard'],
    description: 'Fetches user data from the API with error handling',
    isCustomCard: false,
    markType: 'auto',
    order: 1,
  },
  {
    id: 'card-2',
    type: 'state',
    name: 'userState',
    code: `const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);`,
    startLine: 12,
    endLine: 14,
    status: 'success',
    expanded: false,
    editable: true,
    dependencies: [],
    dependents: ['UserProfile', 'loadUserEffect'],
    description: 'User state management with loading and error states',
    isCustomCard: false,
    markType: 'auto',
    order: 2,
  },
  {
    id: 'card-3',
    type: 'effect',
    name: 'loadUserEffect',
    code: `useEffect(() => {
  if (!userId) return;
  
  setLoading(true);
  setError(null);
  
  fetchUserData(userId)
    .then(setUser)
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
}, [userId]);`,
    startLine: 16,
    endLine: 25,
    status: 'warning',
    expanded: false,
    editable: true,
    dependencies: ['fetchUserData', 'userState'],
    dependents: [],
    description: 'Effect to load user data when userId changes',
    isCustomCard: false,
    markType: 'auto',
    order: 3,
  },
  {
    id: 'card-4',
    type: 'component',
    name: 'UserProfile',
    code: `const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <NoUserFound />;

  return (
    <div className="user-profile">
      <Avatar src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>Joined: {formatDate(user.createdAt)}</p>
    </div>
  );
};`,
    startLine: 27,
    endLine: 40,
    status: 'success',
    expanded: false,
    editable: true,
    dependencies: ['userState', 'loadUserEffect'],
    dependents: [],
    description: 'User profile component with loading and error states',
    isCustomCard: false,
    markType: 'auto',
    order: 4,
  },
  {
    id: 'card-5',
    type: 'custom',
    name: 'validation',
    code: `// #card validation
const validateUserInput = (input: UserInput): ValidationResult => {
  const errors: string[] = [];
  
  if (!input.name || input.name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (!input.email || !isValidEmail(input.email)) {
    errors.push('Please provide a valid email address');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
// #end`,
    startLine: 42,
    endLine: 57,
    status: 'error',
    expanded: false,
    editable: true,
    dependencies: ['isValidEmail'],
    dependents: ['UserForm'],
    description: 'Custom validation logic for user input',
    isCustomCard: true,
    markType: 'hash',
    order: 5,
  },
];

const libraryCards = [
  {
    id: 'lib-1',
    name: 'debounce',
    type: 'function',
    description: 'Debounce utility function',
    code: 'const debounce = (fn, delay) => { /* ... */ }',
  },
  {
    id: 'lib-2',
    name: 'useLocalStorage',
    type: 'custom',
    description: 'Local storage hook',
    code: 'const useLocalStorage = (key, defaultValue) => { /* ... */ }',
  },
  {
    id: 'lib-3',
    name: 'formatDate',
    type: 'function',
    description: 'Date formatting utility',
    code: 'const formatDate = (date) => { /* ... */ }',
  },
];

// Meta configuration
const meta: Meta<typeof CardPanel> = {
  title: 'Components/CardPanel',
  component: CardPanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# CardPanel Component

A powerful panel for displaying, organizing, and managing code cards with advanced filtering, search, and interaction features.

## Features
- 🎯 **Card Management** - View, edit, delete, and organize code cards
- 🔍 **Search & Filter** - Find cards by name, type, status, or content
- 📚 **Library Integration** - Save and reuse cards across projects
- 🔗 **Dependencies** - Visualize relationships between cards
- 🎨 **Multiple Views** - List, grid, and compact view modes
- ⚡ **Real-time Updates** - Synchronized with code editor
- 🎭 **Animations** - Smooth transitions and interactions

## Card Types
- **Function** ⚡ - Function declarations and expressions
- **State** 🔄 - React state management (useState, useReducer)
- **Effect** 💫 - Side effects (useEffect, custom hooks)
- **Component** ⚛️ - React components
- **Class** 🏗️ - Class definitions
- **Custom** 🎨 - Custom marked code blocks

## Usage
The CardPanel automatically parses code and creates cards, or you can create custom cards using markers:
- \`// #card name\` ... \`// #end\`
- \`// @card name\` ... \`// @end\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    cards: {
      control: 'object',
      description: 'Array of code cards to display',
    },
    width: {
      control: { type: 'range', min: 200, max: 800, step: 50 },
      description: 'Panel width in pixels',
    },
    theme: {
      control: 'select',
      options: ['dark', 'light'],
      description: 'Panel color theme',
    },
    isVisible: {
      control: 'boolean',
      description: 'Whether the panel is visible',
    },
    showLibrary: {
      control: 'boolean',
      description: 'Show library section',
    },
    showDependencies: {
      control: 'boolean',
      description: 'Show card dependencies',
    },
    filterType: {
      control: 'select',
      options: ['all', 'function', 'state', 'effect', 'custom'],
      description: 'Default filter type',
    },
    sortBy: {
      control: 'select',
      options: ['name', 'type', 'order', 'status'],
      description: 'Default sort criteria',
    },
  },
} satisfies Meta<typeof CardPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    cards: sampleCards,
    width: 400,
    theme: 'dark',
    isVisible: true,
    onCardClick: action('card-clicked'),
    onCardToggle: action('card-toggled'),
    onCardEdit: action('card-edited'),
    onCardDelete: action('card-deleted'),
    onCardSave: action('card-saved'),
  },
};

// Theme variations
export const LightTheme: Story = {
  args: {
    ...Default.args,
    theme: 'light',
  },
};

export const DarkTheme: Story = {
  args: {
    ...Default.args,
    theme: 'dark',
  },
};

// Size variations
export const Narrow: Story = {
  args: {
    ...Default.args,
    width: 300,
  },
};

export const Wide: Story = {
  args: {
    ...Default.args,
    width: 600,
  },
};

// Card type specific stories
export const FunctionsOnly: Story = {
  args: {
    ...Default.args,
    cards: sampleCards.filter(card => card.type === 'function'),
    filterType: 'function',
  },
};

export const StatesAndEffects: Story = {
  args: {
    ...Default.args,
    cards: sampleCards.filter(card => ['state', 'effect'].includes(card.type)),
  },
};

export const CustomCards: Story = {
  args: {
    ...Default.args,
    cards: sampleCards.filter(card => card.type === 'custom'),
    filterType: 'custom',
  },
};

// Status variations
export const WithErrors: Story = {
  args: {
    ...Default.args,
    cards: sampleCards.map(card => ({ ...card, status: 'error' as const })),
  },
};

export const WithWarnings: Story = {
  args: {
    ...Default.args,
    cards: sampleCards.map(card => ({ ...card, status: 'warning' as const })),
  },
};

export const MixedStatus: Story = {
  args: {
    ...Default.args,
    cards: sampleCards,
  },
};

// Feature demonstrations
export const WithDependencies: Story = {
  args: {
    ...Default.args,
    showDependencies: true,
    cards: sampleCards.map(card => ({ ...card, expanded: true })),
  },
};

export const WithLibrary: Story = {
  args: {
    ...Default.args,
    showLibrary: true,
    libraryCards,
    onToggleLibrary: action('library-toggled'),
  },
};

export const WithPreselectedCard: Story = {
  args: {
    ...Default.args,
    selectedCardId: 'card-2',
    cards: sampleCards.map(card => 
      card.id === 'card-2' ? { ...card, expanded: true } : card
    ),
  },
};

// Empty states
export const EmptyPanel: Story = {
  args: {
    ...Default.args,
    cards: [],
  },
};

export const EmptyLibrary: Story = {
  args: {
    ...Default.args,
    cards: [],
    showLibrary: true,
    libraryCards: [],
  },
};

// Interactive examples
export const Interactive: Story = {
  args: {
    ...Default.args,
    cards: sampleCards,
    showLibrary: true,
    libraryCards,
    showDependencies: true,
    onToggleLibrary: action('library-toggled'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test search functionality
    const searchInput = await canvas.findByPlaceholderText('Search cards...');
    await userEvent.type(searchInput, 'user');
    
    // Test card expansion
    const expandButton = await canvas.findAllByRole('button');
    await userEvent.click(expandButton[1]); // First expand button
    
    // Test card interaction
    const firstCard = await canvas.findByText('fetchUserData');
    await userEvent.click(firstCard);
  },
};

// Performance test
export const ManyCards: Story = {
  args: {
    ...Default.args,
    cards: Array.from({ length: 50 }, (_, i) => ({
      ...sampleCards[i % sampleCards.length],
      id: `card-${i}`,
      name: `${sampleCards[i % sampleCards.length].name}_${i}`,
      order: i,
    })),
  },
};

// Search and filter demonstrations
export const SearchDemo: Story = {
  args: {
    ...Default.args,
    searchQuery: 'user',
  },
};

export const FilteredByType: Story = {
  args: {
    ...Default.args,
    filterType: 'function',
  },
};

// Real-world scenarios
export const ReactComponent: Story = {
  args: {
    ...Default.args,
    cards: [
      {
        id: 'hooks',
        type: 'custom',
        name: 'Custom Hooks',
        code: `const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetchUser(userId).then(setUser).finally(() => setLoading(false));
    }
  }, [userId]);
  
  return { user, loading };
};`,
        startLine: 1,
        endLine: 12,
        status: 'success',
        expanded: true,
        editable: true,
        dependencies: ['fetchUser'],
        dependents: ['UserProfile'],
        description: 'Custom hook for user data management',
        isCustomCard: true,
        markType: 'hash',
        order: 1,
      },
    ],
    showDependencies: true,
  },
};

export const TypeScriptValidation: Story = {
  args: {
    ...Default.args,
    cards: [
      {
        id: 'validation',
        type: 'function',
        name: 'zodValidation',
        code: `const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().min(13).max(120),
});

const validateUser = (data: unknown): User => {
  return UserSchema.parse(data);
};`,
        startLine: 1,
        endLine: 10,
        status: 'success',
        expanded: true,
        editable: true,
        dependencies: ['zod'],
        dependents: ['createUser', 'updateUser'],
        description: 'Zod schema validation for user data',
        isCustomCard: false,
        markType: 'auto',
        order: 1,
      },
    ],
    showDependencies: true,
  },
};

// Edge cases
export const LongCardNames: Story = {
  args: {
    ...Default.args,
    cards: [
      {
        ...sampleCards[0],
        name: 'this_is_a_very_long_function_name_that_should_be_truncated_properly_in_the_UI',
        description: 'This is also a very long description that should be handled gracefully by the card component without breaking the layout',
      },
    ],
  },
};

export const SpecialCharacters: Story = {
  args: {
    ...Default.args,
    cards: [
      {
        ...sampleCards[0],
        name: 'función_with_special_chars_é_ñ_ü',
        code: 'const función = () => {\n  console.log("¡Hola mundo! 🚀");\n};',
        description: 'Function with special characters and emojis',
      },
    ],
  },
};