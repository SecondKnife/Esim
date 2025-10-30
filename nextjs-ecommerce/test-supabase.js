// Test Supabase Connection
// Run: node test-supabase.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testSupabase() {
  console.log('🔍 Testing Supabase connection...\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials not found!');
    console.log('\nMake sure these are in your .env file:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
    process.exit(1);
  }

  console.log('✅ Supabase credentials found');
  console.log('📝 URL:', supabaseUrl);
  console.log('📝 Key:', supabaseKey.substring(0, 20) + '...\n');

  // Create client
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test 1: Fetch products
    console.log('🧪 Test 1: Fetching products...');
    const { data: products, error: productsError } = await supabase
      .from('Product')
      .select('*')
      .limit(5);

    if (productsError) {
      console.error('❌ Error fetching products:', productsError.message);
    } else {
      console.log(`✅ Found ${products?.length || 0} products`);
      if (products && products.length > 0) {
        console.log('   First product:', products[0].title);
      }
    }

    // Test 2: Fetch categories
    console.log('\n🧪 Test 2: Fetching categories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('Category')
      .select('*')
      .limit(5);

    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError.message);
    } else {
      console.log(`✅ Found ${categories?.length || 0} categories`);
      if (categories && categories.length > 0) {
        console.log('   First category:', categories[0].category);
      }
    }

    // Test 3: Count users
    console.log('\n🧪 Test 3: Counting users...');
    const { count, error: countError } = await supabase
      .from('User')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error counting users:', countError.message);
    } else {
      console.log(`✅ Found ${count} users`);
    }

    console.log('\n🎉 All Supabase tests passed!');
    console.log('👉 Supabase is working correctly!\n');

  } catch (error) {
    console.error('\n❌ Supabase test failed!');
    console.error('Error:', error.message);
    
    console.log('\n💡 Possible fixes:');
    console.log('1. Verify SUPABASE_URL is correct');
    console.log('2. Verify ANON_KEY is correct');
    console.log('3. Check Supabase project is active');
    console.log('4. Ensure tables exist in Supabase');
    
    process.exit(1);
  }
}

testSupabase();

