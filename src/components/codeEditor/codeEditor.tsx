'use client';

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Code, Play, Bug, Save } from 'lucide-react';
import { CodeEditorProps, CodeEditorRef, CodeEditorState } from './codeEditor.types';
import { validateCodeEditorProps } from './codeEditor.schema';
import { useCodeEditorStyles } from './codeEditor.styles';

export const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>((props, ref) => {
  // Validate props with Zod
  const validatedProps = validateCodeEditorProps(props);
  
  const {
    code,
    fileName = 'untitled.tsx',
    language = 'tsx',
    theme = 'dark',
    readOnly = false,
    onCodeChange,
    onLineClick,
    onCursorChange,
    lineNumbers = true,
    wordWrap = true,
    fontSize = 14,
    tabSize = 2,
    selectedCard,
    isAnalyzing = false,
    currentAnalyzeLine,
    selectedLineForInsert,
    highlightedLines = [],
  } = validatedProps;

  const styles = useCodeEditorStyles({ theme, fontSize });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  
  // Internal state
  const [editorState, setEditorState] = React.useState<CodeEditorState>({
    scrollTop: 0,
    cursorPosition: { line: 1, column: 1 },
    isEditing: false,
    hasUnsavedChanges: false,
  });

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    blur: () => textareaRef.current?.blur(),
    scrollToLine: (line: number) => {
      if (textareaRef.current) {
        const lineHeight = fontSize * 1.5;
        const scrollTo = (line - 1) * lineHeight;
        textareaRef.current.scrollTop = scrollTo;
        setEditorState(prev => ({ ...prev, scrollTop: scrollTo }));
      }
    },
    getSelectedText: () => {
      if (textareaRef.current) {
        const { selectionStart, selectionEnd } = textareaRef.current;
        return code.substring(selectionStart, selectionEnd);
      }
      return '';
    },
    insertText: (text: string, position) => {
      if (textareaRef.current && onCodeChange) {
        const textarea = textareaRef.current;
        const start = position ? 
          getPositionFromLineColumn(code, position.line, position.column) : 
          textarea.selectionStart;
        
        const newCode = code.substring(0, start) + text + code.substring(start);
        onCodeChange(newCode);
      }
    },
    undo: () => {
      // Implementation for undo functionality
      console.log('Undo operation');
    },
    redo: () => {
      // Implementation for redo functionality
      console.log('Redo operation');
    },
  }), [code, fontSize, onCodeChange]);

  // Handle code changes
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setEditorState(prev => ({ ...prev, hasUnsavedChanges: true }));
    onCodeChange?.(newCode);
  };

  // Handle line clicks
  const handleLineClick = (lineNumber: number) => {
    setEditorState(prev => ({ 
      ...prev, 
      cursorPosition: { line: lineNumber, column: 1 } 
    }));
    onLineClick?.(lineNumber);
  };

  // Handle scroll synchronization
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setEditorState(prev => ({ ...prev, scrollTop }));
    
    // Sync line numbers scroll
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollTop;
    }
  };

  // Render line numbers
  const renderLineNumbers = () => {
    const lines = code.split('\n');
    
    return lines.map((_, index) => {
      const lineNumber = index + 1;
      const isHighlighted = selectedCard && 
        lineNumber >= selectedCard.startLine && 
        lineNumber <= selectedCard.endLine;
      const isAnalyzingLine = isAnalyzing && currentAnalyzeLine === lineNumber;
      const isSelectedForInsert = selectedLineForInsert === lineNumber;
      const isHighlightedLine = highlightedLines.includes(lineNumber);
      
      return (
        <div
          key={index}
          onClick={() => handleLineClick(lineNumber)}
          className={styles.lineNumber(
            isHighlighted || isHighlightedLine, 
            isAnalyzingLine, 
            isSelectedForInsert
          )}
          title={`Line ${lineNumber}`}
        >
          {lineNumber}
        </div>
      );
    });
  };

  // Get file extension for syntax highlighting hint
  const getFileIcon = () => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx': case 'jsx': return '⚛️';
      case 'ts': return '📘';
      case 'js': return '📜';
      default: return '📄';
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-400" />
            <span className="font-semibold flex items-center gap-1">
              {getFileIcon()} {fileName}
            </span>
            {editorState.hasUnsavedChanges && (
              <span className="text-xs text-yellow-400">● Modified</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            {isAnalyzing && currentAnalyzeLine && (
              <span className={styles.analysisIndicator}>
                <Bug className="w-3 h-3 inline mr-1" />
                Analyzing line {currentAnalyzeLine}...
              </span>
            )}
            
            {selectedLineForInsert && (
              <span className={styles.insertIndicator}>
                Insert at line {selectedLineForInsert}
              </span>
            )}
            
            <span className="text-gray-400">
              Line {editorState.cursorPosition.line}, Col {editorState.cursorPosition.column}
            </span>
          </div>
        </div>
      </div>
      
      {/* Editor */}
      <div className={styles.editorContainer}>
        <div className="absolute inset-0 flex">
          {/* Line Numbers */}
          {lineNumbers && (
            <div ref={lineNumbersRef} className={styles.lineNumbers}>
              <div style={{ transform: `translateY(-${editorState.scrollTop}px)` }}>
                {renderLineNumbers()}
              </div>
            </div>
          )}
          
          {/* Code Area */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleCodeChange}
              onScroll={handleScroll}
              readOnly={readOnly}
              className={styles.textarea}
              style={{ 
                lineHeight: `${fontSize * 1.5}px`,
                fontSize: `${fontSize}px`,
                tabSize: tabSize,
              }}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              placeholder={`// Start coding in ${language}...
// Use // #card name or // @card name to create custom cards
// Example:
// #card myFunction
function myFunction() {
  return 'Hello World';
}
// #end`}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;

// Utility functions
function getPositionFromLineColumn(code: string, line: number, column: number): number {
  const lines = code.split('\n');
  let position = 0;
  
  for (let i = 0; i < line - 1 && i < lines.length; i++) {
    position += lines[i].length + 1; // +1 for newline
  }
  
  return position + Math.min(column - 1, lines[line - 1]?.length || 0);
}