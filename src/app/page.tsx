'use client';

import React, { useState } from 'react';
import { CodeEditor } from '@/components/codeEditor/codeEditor';
import { CardPanel } from '@/components/cardPanel/cardPanel';

const sampleCode = `import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // #card fetchUser
  const fetchUser = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(\`/api/users/\${id}\`);
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError('Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };
  // #end

  useEffect(() => {
    fetchUser('123');
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-profile">
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
    </div>
  );
};

export default UserProfile;`;

export default function HomePage() {
  const [code, setCode] = useState(sampleCode);
  const [selectedCardId, setSelectedCardId] = useState<string>();

  // Mock cards data (seria gerado automaticamente pelo parser)
  const mockCards = [
    {
      id: 'card-1',
      type: 'function' as const,
      name: 'fetchUser',
      code: `const fetchUser = async (id: string) => {
  setLoading(true);
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    const userData = await response.json();
    setUser(userData);
  } catch (err) {
    setError('Failed to fetch user');
  } finally {
    setLoading(false);
  }
};`,
      startLine: 15,
      endLine: 26,
      status: 'success' as const,
      expanded: false,
      editable: true,
      dependencies: ['setLoading', 'setUser', 'setError'],
      dependents: [],
      description: 'Fetches user data from API',
      isCustomCard: true,
      markType: 'hash' as const,
      order: 1,
    },
    {
      id: 'card-2',
      type: 'state' as const,
      name: 'userState',
      code: `const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);`,
      startLine: 8,
      endLine: 10,
      status: 'success' as const,
      expanded: false,
      editable: true,
      dependencies: [],
      dependents: ['fetchUser'],
      description: 'User state management',
      isCustomCard: false,
      markType: 'auto' as const,
      order: 2,
    },
    {
      id: 'card-3',
      type: 'effect' as const,
      name: 'fetchEffect',
      code: `useEffect(() => {
  fetchUser('123');
}, []);`,
      startLine: 29,
      endLine: 31,
      status: 'warning' as const,
      expanded: false,
      editable: true,
      dependencies: ['fetchUser'],
      dependents: [],
      description: 'Effect to fetch user on mount',
      isCustomCard: false,
      markType: 'auto' as const,
      order: 3,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gray-800 border-b border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">🚀 CodeSplit</h1>
            <span className="text-sm text-gray-400">
              Visual Code Editor & Analyzer
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Cards: {mockCards.length}</span>
            <span>Lines: {code.split('\n').length}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 pt-16">
        {/* Code Editor */}
        <div className="flex-1">
          <CodeEditor
            code={code}
            onChange={setCode}
            language="typescript"
            theme="dark"
            selectedLine={selectedCardId ? mockCards.find(c => c.id === selectedCardId)?.startLine : undefined}
            onLineClick={(line) => console.log('Line clicked:', line)}
            onCardClick={(cardId) => setSelectedCardId(cardId)}
            showLineNumbers={true}
            wordWrap={true}
            fontSize={14}
            tabSize={2}
          />
        </div>

        {/* Card Panel */}
        <CardPanel
          cards={mockCards}
          width={400}
          theme="dark"
          isVisible={true}
          selectedCardId={selectedCardId}
          onCardClick={setSelectedCardId}
          onCardToggle={(cardId) => console.log('Toggle card:', cardId)}
          onCardEdit={(cardId, newCode) => console.log('Edit card:', cardId, newCode)}
          onCardDelete={(cardId) => console.log('Delete card:', cardId)}
          onCardSave={(cardId) => console.log('Save card:', cardId)}
          showDependencies={true}
          showLibrary={false}
        />
      </div>
    </div>
  );
}