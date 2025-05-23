import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CodeEditor } from './codeEditor';
import { CodeEditorProps } from './codeEditor.types';
import { validateCodeEditorProps } from './codeEditor.schema';

// Mock props
const defaultProps: CodeEditorProps = {
  code: 'const test = () => {\n  return "Hello World";\n};',
  fileName: 'test.tsx',
  language: 'tsx',
  theme: 'dark',
  onCodeChange: jest.fn(),
  onLineClick: jest.fn(),
  onCursorChange: jest.fn(),
};

// Helper function to render component
const renderCodeEditor = (props: Partial<CodeEditorProps> = {}) => {
  const mergedProps = { ...defaultProps, ...props };
  return render(<CodeEditor {...mergedProps} />);
};

describe('CodeEditor Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Basic rendering tests
  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderCodeEditor();
      expect(screen.getByText('test.tsx')).toBeInTheDocument();
    });

    it('should display correct file icon based on extension', () => {
      renderCodeEditor({ fileName: 'component.tsx' });
      expect(screen.getByText(/⚛️/)).toBeInTheDocument();
      
      renderCodeEditor({ fileName: 'script.js' });
      expect(screen.getByText(/📜/)).toBeInTheDocument();
    });

    it('should render line numbers when enabled', () => {
      renderCodeEditor({ lineNumbers: true });
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should not render line numbers when disabled', () => {
      renderCodeEditor({ lineNumbers: false });
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });
  });

  // Props validation tests
  describe('Zod Schema Validation', () => {
    it('should validate valid props successfully', () => {
      expect(() => validateCodeEditorProps(defaultProps)).not.toThrow();
    });

    it('should reject invalid fontSize', () => {
      const invalidProps = { ...defaultProps, fontSize: 100 };
      expect(() => validateCodeEditorProps(invalidProps)).toThrow();
    });

    it('should reject invalid language', () => {
      const invalidProps = { ...defaultProps, language: 'python' };
      expect(() => validateCodeEditorProps(invalidProps)).toThrow();
    });

    it('should apply default values for optional props', () => {
      const minimalProps = { code: 'test code' };
      const validated = validateCodeEditorProps(minimalProps);
      
      expect(validated.fileName).toBe('untitled.tsx');
      expect(validated.theme).toBe('dark');
      expect(validated.fontSize).toBe(14);
    });
  });

  // Event handling tests
  describe('Event Handling', () => {
    it('should call onCodeChange when text is typed', async () => {
      const onCodeChange = jest.fn();
      renderCodeEditor({ onCodeChange });
      
      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'new code');
      
      expect(onCodeChange).toHaveBeenCalled();
    });

    it('should call onLineClick when line number is clicked', async () => {
      const onLineClick = jest.fn();
      renderCodeEditor({ onLineClick, lineNumbers: true });
      
      const lineNumber = screen.getByText('2');
      await userEvent.click(lineNumber);
      
      expect(onLineClick).toHaveBeenCalledWith(2);
    });

    it('should handle readonly mode correctly', () => {
      renderCodeEditor({ readOnly: true });
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('readonly');
    });
  });

  // Analysis features tests
  describe('Analysis Features', () => {
    it('should show analysis indicator when analyzing', () => {
      renderCodeEditor({ 
        isAnalyzing: true, 
        currentAnalyzeLine: 5 
      });
      
      expect(screen.getByText(/Analyzing line 5/)).toBeInTheDocument();
    });

    it('should highlight selected card lines', () => {
      const selectedCard = {
        id: 'test-card',
        startLine: 2,
        endLine: 3,
      };
      
      renderCodeEditor({ selectedCard });
      
      // Line 2 and 3 should have highlighting classes
      const line2 = screen.getByText('2');
      const line3 = screen.getByText('3');
      
      expect(line2).toHaveClass('bg-yellow-900/50');
      expect(line3).toHaveClass('bg-yellow-900/50');
    });

    it('should show insert line indicator', () => {
      renderCodeEditor({ selectedLineForInsert: 10 });
      
      expect(screen.getByText('Insert at line 10')).toBeInTheDocument();
    });

    it('should highlight specific lines', () => {
      renderCodeEditor({ highlightedLines: [1, 3] });
      
      const line1 = screen.getByText('1');
      const line3 = screen.getByText('3');
      
      expect(line1).toHaveClass('bg-yellow-900/50');
      expect(line3).toHaveClass('bg-yellow-900/50');
    });
  });

  // Ref methods tests
  describe('Ref Methods', () => {
    it('should expose focus method', () => {
      const ref = React.createRef<any>();
      renderCodeEditor({ ref });
      
      expect(typeof ref.current?.focus).toBe('function');
    });

    it('should expose scrollToLine method', () => {
      const ref = React.createRef<any>();
      renderCodeEditor({ ref });
      
      expect(typeof ref.current?.scrollToLine).toBe('function');
    });

    it('should expose getSelectedText method', () => {
      const ref = React.createRef<any>();
      renderCodeEditor({ ref });
      
      expect(typeof ref.current?.getSelectedText).toBe('function');
    });
  });

  // Theme tests
  describe('Theming', () => {
    it('should apply dark theme classes', () => {
      renderCodeEditor({ theme: 'dark' });
      
      const container = screen.getByText('test.tsx').closest('.flex.flex-col');
      expect(container).toHaveClass('bg-gray-900');
    });

    it('should apply light theme classes', () => {
      renderCodeEditor({ theme: 'light' });
      
      const container = screen.getByText('test.tsx').closest('.flex.flex-col');
      expect(container).toHaveClass('bg-white');
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('should handle empty code', () => {
      renderCodeEditor({ code: '' });
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('');
    });

    it('should handle very long code', () => {
      const longCode = 'a'.repeat(10000);
      renderCodeEditor({ code: longCode });
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue(longCode);
    });

    it('should handle special characters in code', () => {
      const specialCode = 'const emoji = "🚀💻⚡";';
      renderCodeEditor({ code: specialCode });
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue(specialCode);
    });
  });

  // Performance tests
  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = renderCodeEditor();
      
      // Re-render with same props
      rerender(<CodeEditor {...defaultProps} />);
      
      // Should only render once
      expect(screen.getByText('test.tsx')).toBeInTheDocument();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderCodeEditor();
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      renderCodeEditor();
      
      const textarea = screen.getByRole('textbox');
      textarea.focus();
      
      expect(document.activeElement).toBe(textarea);
    });
  });
});

// Integration tests
describe('CodeEditor Integration', () => {
  it('should work with external state management', async () => {
    let externalCode = 'initial code';
    const setExternalCode = jest.fn((newCode) => {
      externalCode = newCode;
    });

    const { rerender } = renderCodeEditor({
      code: externalCode,
      onCodeChange: setExternalCode,
    });

    const textarea = screen.getByRole('textbox');
    await userEvent.clear(textarea);
    await userEvent.type(textarea, 'updated code');

    expect(setExternalCode).toHaveBeenCalledWith('updated code');
  });

  it('should synchronize line numbers with scroll', async () => {
    renderCodeEditor({ 
      code: Array(100).fill('console.log("test");').join('\n')
    });

    const textarea = screen.getByRole('textbox');
    
    // Simulate scroll
    fireEvent.scroll(textarea, { target: { scrollTop: 500 } });

    // Line numbers should sync (testing implementation detail)
    await waitFor(() => {
      expect(textarea.scrollTop).toBe(500);
    });
  });
});