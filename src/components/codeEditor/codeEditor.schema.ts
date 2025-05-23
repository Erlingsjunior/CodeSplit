import { z } from 'zod';

export const CodeEditorPropsSchema = z.object({
  // Required props
  code: z.string().min(0, 'Code cannot be negative length'),
  
  // Optional props with defaults
  fileName: z.string().default('untitled.tsx'),
  language: z.enum(['javascript', 'typescript', 'jsx', 'tsx']).default('tsx'),
  theme: z.enum(['dark', 'light']).default('dark'),
  readOnly: z.boolean().default(false),
  
  // Event handlers
  onCodeChange: z.function(z.tuple([z.string()]), z.void()).optional(),
  onLineClick: z.function(z.tuple([z.number()]), z.void()).optional(),
  onCursorChange: z.function(z.tuple([z.number(), z.number()]), z.void()).optional(),
  
  // Editor configuration
  lineNumbers: z.boolean().default(true),
  wordWrap: z.boolean().default(true),
  fontSize: z.number().min(8).max(72).default(14),
  tabSize: z.number().min(1).max(8).default(2),
  
  // Analysis props
  selectedCard: z.object({
    id: z.string(),
    startLine: z.number(),
    endLine: z.number(),
  }).optional(),
  
  isAnalyzing: z.boolean().default(false),
  currentAnalyzeLine: z.number().optional(),
  selectedLineForInsert: z.number().optional(),
  
  // Custom validation for line numbers
  highlightedLines: z.array(z.number().min(1)).default([]),
});

export const CodeEditorStateSchema = z.object({
  scrollTop: z.number().default(0),
  cursorPosition: z.object({
    line: z.number(),
    column: z.number(),
  }).default({ line: 1, column: 1 }),
  
  isEditing: z.boolean().default(false),
  hasUnsavedChanges: z.boolean().default(false),
  lastSavedAt: z.date().optional(),
});

// Validation functions
export const validateCodeEditorProps = (props: unknown) => {
  return CodeEditorPropsSchema.parse(props);
};

export const validateCodeEditorState = (state: unknown) => {
  return CodeEditorStateSchema.parse(state);
};

// Complex validation examples
export const CodeAnalysisSchema = z.object({
  totalLines: z.number().min(0),
  totalCharacters: z.number().min(0),
  errors: z.array(z.object({
    line: z.number(),
    column: z.number(),
    message: z.string(),
    severity: z.enum(['error', 'warning', 'info']),
  })),
  
  // Custom validation for file extensions
  fileExtension: z.string().refine(
    (ext) => ['.js', '.jsx', '.ts', '.tsx'].includes(ext),
    { message: 'File extension must be .js, .jsx, .ts, or .tsx' }
  ),
});