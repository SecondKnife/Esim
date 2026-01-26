/**
 * Deploy Frontend to Cloudflare R2
 * 
 * This script builds the Next.js app and uploads it to R2 bucket
 * 
 * Usage:
 *   node scripts/deploy-r2.js
 * 
 * Required environment variables:
 *   R2_ACCOUNT_ID
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *   R2_BUCKET_NAME (for frontend static files)
 *   NEXT_PUBLIC_API_URL (backend API URL)
 */

const { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

// Load environment variables
// Try .env.local first, then fallback to .env
const envLocalPath = path.resolve(__dirname, '../.env.local');
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envLocalPath)) {
  require('dotenv').config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  // In Cloudflare Pages, env vars are available via process.env
  console.log('ℹ️  No .env file found, using environment variables from system');
}

// R2 Configuration (R2 is S3-compatible)
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_FRONTEND_BUCKET_NAME || process.env.R2_BUCKET_NAME;
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

// Validate required environment variables
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error('❌ Error: Missing required environment variables!');
  console.error('Required:');
  console.error('  - R2_ACCOUNT_ID');
  console.error('  - R2_ACCESS_KEY_ID');
  console.error('  - R2_SECRET_ACCESS_KEY');
  console.error('  - R2_FRONTEND_BUCKET_NAME or R2_BUCKET_NAME');
  process.exit(1);
}

if (!NEXT_PUBLIC_API_URL) {
  console.warn('⚠️  Warning: NEXT_PUBLIC_API_URL not set. Frontend may not work correctly.');
}

// Initialize S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Build directory
const BUILD_DIR = path.resolve(__dirname, '../out');

/**
 * Upload a file to R2
 */
async function uploadFile(filePath, key) {
  const fileContent = fs.readFileSync(filePath);
  const contentType = mime.lookup(filePath) || 'application/octet-stream';

  // Set proper content type for HTML files
  let finalContentType = contentType;
  if (key.endsWith('.html')) {
    finalContentType = 'text/html; charset=utf-8';
  } else if (key.endsWith('.js')) {
    finalContentType = 'application/javascript';
  } else if (key.endsWith('.css')) {
    finalContentType = 'text/css';
  } else if (key.endsWith('.json')) {
    finalContentType = 'application/json';
  }

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: finalContentType,
    // Cache control for static assets
    CacheControl: key.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i)
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=0, must-revalidate',
  });

  try {
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error(`❌ Failed to upload ${key}:`, error.message);
    return false;
  }
}

/**
 * Get all files recursively from a directory
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

/**
 * Delete old files from R2 (optional cleanup)
 */
async function cleanupOldFiles() {
  try {
    console.log('🧹 Cleaning up old files...');
    const listCommand = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
    });

    const response = await s3Client.send(listCommand);
    if (response.Contents && response.Contents.length > 0) {
      for (const object of response.Contents) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: object.Key,
        });
        await s3Client.send(deleteCommand);
      }
      console.log(`✅ Deleted ${response.Contents.length} old files`);
    }
  } catch (error) {
    console.warn('⚠️  Could not cleanup old files:', error.message);
  }
}

/**
 * Main deployment function
 */
async function deploy() {
  console.log('🚀 Starting frontend deployment to R2...\n');

  // Step 1: Check if build directory exists
  if (!fs.existsSync(BUILD_DIR)) {
    console.log('📦 Building Next.js app...');
    try {
      execSync('npm run build', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
    } catch (error) {
      console.error('❌ Build failed!');
      process.exit(1);
    }
  } else {
    console.log('✅ Build directory exists, skipping build...');
    console.log('   (Run "npm run build" manually if you want to rebuild)\n');
  }

  // Step 2: Get all files to upload
  const files = getAllFiles(BUILD_DIR);
  console.log(`📁 Found ${files.length} files to upload\n`);

  // Step 3: Optional cleanup
  // Uncomment the line below if you want to delete old files first
  // await cleanupOldFiles();

  // Step 4: Upload files
  console.log('📤 Uploading files to R2...\n');
  let successCount = 0;
  let failCount = 0;

  for (const filePath of files) {
    // Get relative path from build directory
    const relativePath = path.relative(BUILD_DIR, filePath);
    // Normalize path separators for R2 (use forward slashes)
    const key = relativePath.replace(/\\/g, '/');

    // Skip .DS_Store and other hidden files
    if (path.basename(filePath).startsWith('.')) {
      continue;
    }

    process.stdout.write(`   Uploading: ${key}... `);
    const success = await uploadFile(filePath, key);
    if (success) {
      console.log('✅');
      successCount++;
    } else {
      console.log('❌');
      failCount++;
    }
  }

  console.log('\n📊 Upload Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);

  if (failCount === 0) {
    console.log('\n🎉 Deployment completed successfully!');
    console.log(`\n🌐 Your site should be available at:`);
    console.log(`   https://${R2_BUCKET_NAME}.r2.dev`);
    console.log(`   Or your custom domain if configured`);
  } else {
    console.log('\n⚠️  Deployment completed with errors');
    process.exit(1);
  }
}

// Run deployment
deploy().catch((error) => {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
});

