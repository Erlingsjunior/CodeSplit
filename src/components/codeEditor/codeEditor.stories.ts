import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { CodeEditor } from './codeEditor';
import { CodeEditorProps } from './codeEditor.types';

// Sample code snippets for stories
const sampleReactCode = `import React, { useState, useEffect } from 'react';
import { User, Product } from './types';

interface Props {
  initialData?: any;
  onSave: (data: any) => void;
}

const DataManager: React.FC<Props> = ({ initialData, onSave }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Component mounted');
    loadData();
  }, []);

  // #card loadData
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  // #end

  return (
    <div className="data-manager">
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      
      <button onClick={loadData}>Reload</button>
      
      <div className="items-list">
        {items.map((item, index) => (
          <div key={index}>{item.name}</div>
        ))}
      </div>
    </div>
  );
};

export default DataManager;`;

const sampleTypeScriptCode = `// Type definitions with Zod validation
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
  name: z.string().min(2, 'Name too short').max(50, 'Name too long'),
  email: z.string().email('Invalid email format'),
  age: z.number().min(13, 'Must be at least 13').max(120, 'Invalid age'),
  role: z.enum(['admin', 'user', 'moderator']).default('user'),
  
  // Complex nested validation
  profile: z.object({
    bio: z.string().max(500).optional(),
    avatar: z.string().url().optional(),
    preferences: z.object({
      theme: z.enum(['dark', 'light']).default('dark'),
      notifications: z.boolean().default(true),
    }),
  }),
  
  // Custom validation
  username: z.string().refine(
    (val) => /^[a-zA-Z0-9_]+$/.test(val),
    { message: 'Username can only contain letters, numbers, and underscores' }
  ),
});

export type User = z.infer<typeof UserSchema>;

// Validation function
export const validateUser = (userData: unknown): User => {
  return UserSchema.parse(userData);
};`;

const sampleJavaScriptCode = `// JavaScript utility functions
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// @card arrayUtils
const arrayUtils = {
  chunk: (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
  
  unique: (array) => [...new Set(array)],
  
  groupBy: (array, key) => {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },
};
// @end

export { debounce, throttle, arrayUtils };`;

// Meta configuration
const meta: Meta<typeof CodeEditor> = {
  title: 'Components/CodeEditor',
  component: CodeEditor,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# CodeEditor Component

A powerful code editor with syntax highlighting, line numbers, and analysis features.

## Features
- 🎨 Syntax highlighting for JS/TS/JSX/TSX
- 📝 Line numbers with click handling
- 🔍 Code analysis and error detection
- 🎯 Custom card markers (#card, @card)
- 🎪 Theme support (dark/light)
- ⚡ Real-time validation with Zod
- 🔧 Configurable editor settings

## Custom Card Markers
Use special comments to create code cards:
- \`// #card cardName\` ... \`// #end\`
- \`// @card cardName\` ... \`// @end\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    code: {
      control: 'text',
      description: 'The code content to display and edit',
    },
    fileName: {
      control: 'text',
      description: 'Name of the file being edited',
    },
    language: {
      control: 'select',
      options: ['javascript', 'typescript', 'jsx', 'tsx'],
      description: 'Programming language for syntax highlighting',
    },
    theme: {
      control: 'select',
      options: ['dark', 'light'],
      description: 'Editor color theme',
    },
    fontSize: {
      control: { type: 'range', min: 8, max: 24, step: 1 },
      description: 'Font size in pixels',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the editor is read-only',
    },
    lineNumbers: {
      control: 'boolean',
      description: 'Show line numbers',
    },
    wordWrap: {
      control: 'boolean',
      description: 'Enable word wrapping',
    },
    isAnalyzing: {
      control: 'boolean',
      description: 'Show analysis mode indicators',
    },
  },
} satisfies Meta<typeof CodeEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    code: sampleReactCode,
    fileName: 'DataManager.tsx',
    language: 'tsx',
    theme: 'dark',
    onCodeChange: action('code-changed'),
    onLineClick: action('line-clicked'),
    onCursorChange: action('cursor-changed'),
  },
};

// Different languages
export const TypeScript: Story = {
  args: {
    code: sampleTypeScriptCode,
    fileName: 'types.ts',
    language: 'typescript',
    theme: 'dark',
    onCodeChange: action('code-changed'),
  },
};

export const JavaScript: Story = {
  args: {
    code: sampleJavaScriptCode,
    fileName: 'utils.js',
    language: 'javascript',
    theme: 'dark',
    onCodeChange: action('code-changed'),
  },
};

// Theme variations
export const LightTheme: Story = {
  args: {
    code: sampleReactCode,
    fileName: 'Component.tsx',
    theme: 'light',
    onCodeChange: action('code-changed'),
  },
};

export const DarkTheme: Story = {
  args: {
    code: sampleReactCode,
    fileName: 'Component.tsx',
    theme: 'dark',
    onCodeChange: action('code-changed'),
  },
};

// Configuration variants
export const NoLineNumbers: Story = {
  args: {
    code: sampleJavaScriptCode,
    fileName: 'script.js',
    lineNumbers: false,
    onCodeChange: action('code-changed'),
  },
};

export const ReadOnly: Story = {
  args: {
    code: sampleTypeScriptCode,
    fileName: 'readonly.ts',
    readOnly: true,
    theme: 'dark',
  },
};

export const LargeFont: Story = {
  args: {
    code: sampleReactCode,
    fileName: 'BigText.tsx',
    fontSize: 18,
    onCodeChange: action('code-changed'),
  },
};

// Analysis features
export const WithAnalysis: Story = {
  args: {
    code: sampleReactCode,
    fileName: 'Analyzing.tsx',
    isAnalyzing: true,
    currentAnalyzeLine: 15,
    selectedCard: {
      id: 'loadData',
      startLine: 18,
      endLine: 28,
    },
    onCodeChange: action('code-changed'),
  },
};

export const WithHighlightedLines: Story = {
  args: {
    code: sampleReactCode,
    fileName: 'Highlighted.tsx',
    highlightedLines: [5, 12, 18],
    selectedLineForInsert: 10,
    onCodeChange: action('code-changed'),
  },
};

// Interactive examples
export const Interactive: Story = {
  args: {
    code: `// Try editing this code!
// Add some functions or use card markers

function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

// #card calculator
const calculator = {
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b,
  multiply: (a: number, b: number) => a * b,
  divide: (a: number, b: number) => b !== 0 ? a / b : 0,
};
// #end

export { greet, calculator };`,
    fileName: 'playground.ts',
    language: 'typescript',
    onCodeChange: action('code-changed'),
    onLineClick: action('line-clicked'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test line number clicking
    const lineNumber = await canvas.findByText('5');
    await userEvent.click(lineNumber);
    
    // Test typing in the editor
    const textarea = canvas.getByRole('textbox');
    await userEvent.click(textarea);
    await userEvent.type(textarea, '\n// New comment added!');
  },
};

// Empty state
export const EmptyEditor: Story = {
  args: {
    code: '',
    fileName: 'new-file.tsx',
    language: 'tsx',
    onCodeChange: action('code-changed'),
  },
};

// Error handling
export const WithErrors: Story = {
  args: {
    code: `// This code has intentional issues
console.log("Debug statement"); // This should be flagged

function problematicFunction() {
  let unclosedVariable = "missing semicolon"
  return unclosedVariable
}

// TODO: Fix this function
function unfinishedFunction() {
  // Implementation missing
}`,
    fileName: 'errors.ts',
    language: 'typescript',
    onCodeChange: action('code-changed'),
  },
};

// Performance test with large file
export const LargeFile: Story = {
  args: {
    code: Array(1000).fill(0).map((_, i) => 
      `// Line ${i + 1}\nconst variable${i} = ${i};\n`
    ).join(''),
    fileName: 'large-file.ts',
    language: 'typescript',
    onCodeChange: action('code-changed'),
  },
};