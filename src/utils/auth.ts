// Authentication utility functions
// This is a simplified mock implementation that would be replaced with actual auth

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

// Mock user data
const MOCK_USERS = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'password123',
    name: 'Demo User',
    avatarUrl: '/placeholder.svg',
  }
];

// Mock authentication state
let currentUser: User | null = null;

// Simple login function
export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Don't include password in the returned user object
        const { password, ...userWithoutPassword } = user;
        currentUser = userWithoutPassword;
        
        // Store in localStorage to persist across refreshes
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        resolve(currentUser);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 800);
  });
};

// Register function
export const register = (email: string, password: string, name: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      if (MOCK_USERS.some(u => u.email === email)) {
        reject(new Error('User with this email already exists'));
        return;
      }
      
      const newUser = {
        id: String(MOCK_USERS.length + 1),
        email,
        password, // Note: In a real app, this would be hashed
        name,
        avatarUrl: '/placeholder.svg',
      };
      
      MOCK_USERS.push(newUser);
      
      const { password: _, ...userWithoutPassword } = newUser;
      currentUser = userWithoutPassword;
      
      // Store in localStorage to persist across refreshes
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      resolve(currentUser);
    }, 800);
  });
};

// Logout function
export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentUser = null;
      localStorage.removeItem('currentUser');
      resolve();
    }, 300);
  });
};

// Get current user
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    // First check if we have the current user in memory
    if (currentUser) {
      resolve(currentUser);
      return;
    }
    
    // Otherwise check localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      resolve(currentUser);
      return;
    }
    
    // No user found
    resolve(null);
  });
};

// Check if user is logged in
export const isLoggedIn = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user;
};
