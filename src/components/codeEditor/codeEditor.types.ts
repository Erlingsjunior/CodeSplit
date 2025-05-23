import { z } from 'zod';
import { 
  CodeEditorPropsSchema, 
  CodeEditorStateSchema,
  CodeAnalysisSchema 
} from './codeEditor.schema';

// Infer types from schemas
export type CodeEditorProps = z.infer<typeof CodeEditorPropsSchema>;
export type CodeEditorState = z.infer<typeof CodeEditorStateSchema>;
export type CodeAnalysis = z.infer<typeof CodeAnalysisSchema>;

// Additional types not in schema
export interface CodeEditorRef {
  focus: () => void;
  blur: () => void;
  scrollToLine: (line: number) => void;
  getSelectedText: () => string;
  insertText: (text: string, position?: { line: number; column: number }) => void;
  undo: () => void;
  redo: () => void;
}

// Event handler types
export type CodeChangeHandler = (code: string) => void;
export type LineClickHandler = (lineNumber: number) => void;
export type CursorChangeHandler = (line: number, column: number) => void;

// Editor mode types
export type EditorMode = 'edit' | 'read' | 'analyze' | 'diff';
export type ThemeMode = 'dark' | 'light' | 'auto';

// Line decoration types
export interface LineDecoration {
  line: number;
  type: 'error' | 'warning' | 'info' | 'highlight' | 'breakpoint';
  message?: string;
  className?: string;
}

// Selection types
export interface TextSelection {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

// Editor configuration extended types
export interface EditorConfig {
  autoIndent: boolean;
  autoCloseBrackets: boolean;
  highlightActiveRow: boolean;
  showInvisibles: boolean;
  enableSnippets: boolean;
  enableLiveAutocompletion: boolean;
}