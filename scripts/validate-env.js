import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mode = process.env.NODE_ENV || 'development';
const envFile = mode === 'production' ? '.env.production' : '.env';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '..', envFile) });

const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_APP_ENV'
];

function validateEnv() {
  console.log(`🔍 Validating environment variables from ${envFile}...`);

  const missingVars = requiredEnvVars.filter(varName => {
    const value = process.env[varName];
    return !value || value.trim() === '';
  });

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error(`\nPlease add them to your ${envFile} file.`);
    process.exit(1);
  }

  console.log('✅ Environment variables validation passed!');
}

validateEnv();
