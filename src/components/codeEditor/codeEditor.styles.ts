import { useMemo } from 'react';
import { CodeEditorProps } from './codeEditor.types';

export const useCodeEditorStyles = (props: Pick<CodeEditorProps, 'theme' | 'fontSize'>) => {
  return useMemo(() => {
    const { theme, fontSize } = props;
    
    return {
      container: `
        flex flex-col h-full 
        ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}
        transition-colors duration-200
      `,
      
      header: `
        bg-gray-800 p-2 border-b border-gray-700 flex-shrink-0
        ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'}
      `,
      
      editorContainer: `
        flex-1 relative overflow-hidden
        ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}
      `,
      
      lineNumbers: `
        w-12 border-r overflow-hidden select-none
        ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}
      `,
      
      lineNumber: (isHighlighted: boolean, isAnalyzing: boolean, isSelectedForInsert: boolean) => `
        text-xs text-right px-2 h-6 leading-6 cursor-pointer 
        transition-colors duration-150
        hover:bg-opacity-70
        ${theme === 'dark' ? 'text-gray-500 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-200'}
        ${isHighlighted ? (theme === 'dark' ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-200/50 text-yellow-800') : ''}
        ${isAnalyzing ? 'animate-pulse' : ''}
        ${isSelectedForInsert ? (theme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-200/50 text-green-800') : ''}
      `,
      
      textarea: `
        absolute inset-0 w-full h-full bg-transparent resize-none border-none outline-none p-3
        font-mono transition-all duration-200
        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}
        focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
      `,
      
      // Status indicators
      analysisIndicator: `
        text-xs animate-pulse
        ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}
      `,
      
      insertIndicator: `
        text-xs
        ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}
      `,
      
      // Error states
      errorBorder: `
        border-2 border-red-500 animate-pulse
      `,
      
      warningBorder: `
        border-2 border-yellow-500
      `,
      
      successBorder: `
        border-2 border-green-500
      `,
    };
  }, [props.theme, props.fontSize]);
};

// Alternative: CSS-in-JS object styles
export const codeEditorStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
  },
  
  lineHeight: (fontSize: number) => ({
    lineHeight: `${fontSize * 1.5}px`,
    fontSize: `${fontSize}px`,
  }),
  
  scrollbar: {
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#374151',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#6B7280',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#9CA3AF',
    },
  },
  
  // Responsive styles
  mobile: {
    '@media (max-width: 768px)': {
      fontSize: '12px',
      padding: '8px',
    },
  },
};

// Utility function for dynamic styles
export const getLineNumberWidth = (totalLines: number): number => {
  const digits = totalLines.toString().length;
  return Math.max(digits * 8 + 16, 48); // minimum 48px
};

// Theme variants
export const themeVariants = {
  dark: {
    background: '#111827',
    foreground: '#F3F4F6',
    border: '#374151',
    accent: '#3B82F6',
    muted: '#6B7280',
  },
  light: {
    background: '#FFFFFF',
    foreground: '#111827',
    border: '#D1D5DB',
    accent: '#2563EB',
    muted: '#6B7280',
  },
} as const;