import { User } from '../models/User.js';

export const seedDatabaseIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Database Seed] Seeding initial Admin user account into MongoDB...');
      await User.create({
        name: 'Enterprise School Admin',
        email: 'admin@aurasms.edu',
        password: 'password123',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      });
      console.log('[Database Seed] Admin account ready in MongoDB: admin@aurasms.edu');
    }
  } catch (err) {
    console.error('[Database Seed Error]', err.message);
  }
};
