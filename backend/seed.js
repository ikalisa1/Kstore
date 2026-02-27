require('dotenv').config();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const User = require('./src/models/User');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    // Clear existing users (optional)
    // await User.deleteMany({});

    // Demo users
    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@juakali.com',
        password: 'admin123',
      },
      {
        name: 'Test Store',
        email: 'test@juakali.com',
        password: 'test123',
      },
      {
        name: 'Demo Manager',
        email: 'demo@juakali.com',
        password: 'demo123',
      },
    ];

    console.log('📝 Creating demo users...\n');

    for (const userData of demoUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        // Hash password
        const hashedPassword = await bcryptjs.hash(userData.password, 10);
        
        // Create user
        const user = new User({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
        });
        
        await user.save();
        console.log(`✅ Created user: ${userData.email}`);
      } else {
        console.log(`⏭️  User already exists: ${userData.email}`);
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log('   🎯 TEST CREDENTIALS - READY TO USE   ');
    console.log('═══════════════════════════════════════\n');
    
    demoUsers.forEach((user) => {
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔑 Password: ${user.password}\n`);
    });
    
    console.log('═══════════════════════════════════════');
    console.log('✅ Seed completed successfully!');
    console.log('Go to http://localhost:3000 and login\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
