export const authService = {
  login: async (email, password) => {
    console.log(`(Mock API) Attempting login for: ${email}`);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'intern@example.com' && password === 'password') {
          resolve({
            token: 'fake-jwt-token',
            user: { name: 'Test Intern', email: 'intern@example.com', role: 'intern' },
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },

  register: async (userData) => {
    console.log('(Mock API) Registering user:', userData.name);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
            token: 'new-fake-jwt-token',
            user: { name: userData.name, email: userData.email, role: 'intern' },
        });
      }, 1000);
    });
  },
};