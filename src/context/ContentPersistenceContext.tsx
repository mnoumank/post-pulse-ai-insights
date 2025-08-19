import React, { createContext, useContext, useEffect, useState } from 'react';

interface CreatePostState {
  userIdea: string;
  selectedHook: string;
  selectedCategory: string;
  generatedPost: string;
  activeTab: string;
}

interface ComparisonState {
  postA: string;
  postB: string;
  analysisResults?: {
    analysisA: any;
    analysisB: any;
    enhancedAnalysisA: any;
    enhancedAnalysisB: any;
  };
}

interface ContentPersistenceContextType {
  createPostState: CreatePostState;
  updateCreatePostState: (state: Partial<CreatePostState>) => void;
  clearCreatePostState: () => void;
  comparisonState: ComparisonState;
  updateComparisonState: (state: Partial<ComparisonState>) => void;
  clearComparisonState: () => void;
}

const ContentPersistenceContext = createContext<ContentPersistenceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CREATE_POST: 'viral-analyzer-create-post',
  COMPARISON: 'viral-analyzer-comparison',
};

const defaultCreatePostState: CreatePostState = {
  userIdea: '',
  selectedHook: '',
  selectedCategory: '',
  generatedPost: '',
  activeTab: 'idea',
};

const defaultComparisonState: ComparisonState = {
  postA: '',
  postB: '',
  analysisResults: undefined,
};

export function ContentPersistenceProvider({ children }: { children: React.ReactNode }) {
  const [createPostState, setCreatePostState] = useState<CreatePostState>(defaultCreatePostState);
  const [comparisonState, setComparisonState] = useState<ComparisonState>(defaultComparisonState);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedCreatePost = localStorage.getItem(STORAGE_KEYS.CREATE_POST);
      if (savedCreatePost) {
        setCreatePostState(JSON.parse(savedCreatePost));
      }

      const savedComparison = localStorage.getItem(STORAGE_KEYS.COMPARISON);
      if (savedComparison) {
        setComparisonState(JSON.parse(savedComparison));
      }
    } catch (error) {
      console.error('Error loading saved content:', error);
    }
  }, []);

  const updateCreatePostState = (updates: Partial<CreatePostState>) => {
    setCreatePostState(prev => {
      const newState = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEYS.CREATE_POST, JSON.stringify(newState));
      } catch (error) {
        console.error('Error saving create post state:', error);
      }
      return newState;
    });
  };

  const clearCreatePostState = () => {
    setCreatePostState(defaultCreatePostState);
    try {
      localStorage.removeItem(STORAGE_KEYS.CREATE_POST);
    } catch (error) {
      console.error('Error clearing create post state:', error);
    }
  };

  const updateComparisonState = (updates: Partial<ComparisonState>) => {
    setComparisonState(prev => {
      const newState = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEYS.COMPARISON, JSON.stringify(newState));
      } catch (error) {
        console.error('Error saving comparison state:', error);
      }
      return newState;
    });
  };

  const clearComparisonState = () => {
    setComparisonState(defaultComparisonState);
    try {
      localStorage.removeItem(STORAGE_KEYS.COMPARISON);
    } catch (error) {
      console.error('Error clearing comparison state:', error);
    }
  };

  return (
    <ContentPersistenceContext.Provider
      value={{
        createPostState,
        updateCreatePostState,
        clearCreatePostState,
        comparisonState,
        updateComparisonState,
        clearComparisonState,
      }}
    >
      {children}
    </ContentPersistenceContext.Provider>
  );
}

export function useContentPersistence() {
  const context = useContext(ContentPersistenceContext);
  if (context === undefined) {
    throw new Error('useContentPersistence must be used within a ContentPersistenceProvider');
  }
  return context;
}