// Setup default users for testing
export const setupDefaultUsers = () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Check if admin user already exists
  const adminExists = users.some(user => user.role === 'admin');
  
  if (!adminExists) {
    const defaultAdmin = {
      id: 1001, // Changed from 1 to 1001
      name: 'Admin User',
      email: 'dgarg5_be23@thapar.edu',
      password: 'Dob-131105',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    
    users.push(defaultAdmin);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Default admin user created: admin@jobportal.com / admin123');
  }
  
  // Check if test user exists
  const testUserExists = users.some(user => user.email === 'user@test.com');
  
  if (!testUserExists) {
    const testUser = {
      id: 2,
      name: 'Test User',
      email: 'user@test.com',
      password: 'user123',
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    users.push(testUser);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Test user created: user@test.com / user123');
  }
};

