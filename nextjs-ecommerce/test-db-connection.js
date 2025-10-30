// Test Database Connection
// Run: node test-db-connection.js

const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set!');
    console.log('Create a .env file with:');
    console.log('DATABASE_URL="your-connection-string"');
    process.exit(1);
  }
  
  console.log('✅ DATABASE_URL found');
  console.log('📝 Connection string format:', process.env.DATABASE_URL.split('@')[0] + '@...');
  
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });
  
  try {
    console.log('\n🔌 Attempting to connect...');
    await prisma.$connect();
    console.log('✅ Connection successful!\n');
    
    // Test query
    console.log('🧪 Running test query...');
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('✅ Query successful:', result);
    
    // Get counts
    console.log('\n📊 Getting database stats...');
    const [users, products, categories] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count(),
    ]);
    
    console.log('✅ Database Stats:');
    console.log(`   Users: ${users}`);
    console.log(`   Products: ${products}`);
    console.log(`   Categories: ${categories}`);
    
    console.log('\n🎉 All tests passed!');
    console.log('👉 Your DATABASE_URL is correct and working!\n');
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('Can\'t reach database')) {
      console.log('\n💡 Possible fixes:');
      console.log('1. Check if connection string uses .pooler.supabase.com');
      console.log('2. Verify password is URL-encoded if it has special characters');
      console.log('3. Make sure Supabase project is active');
      console.log('4. Check if using postgresql:// (not postgres://)');
    }
    
    if (error.message.includes('invalid connection string')) {
      console.log('\n💡 Connection string format should be:');
      console.log('postgresql://postgres.[ref]:[password]@aws-0-region.pooler.supabase.com:5432/postgres');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

