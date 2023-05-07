/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const projectUrl = process.env.SUPABASE_PROJECT_URL;
const apiKey = process.env.SUPABASE_SERVICE_API_KEY;
const bucketName = process.env.SUPABASE_BUCKET_NAME;

const supabase = createClient(projectUrl, apiKey);

(async () => {
  /* Create bucket in Supabase */
  console.log('Creating Supabase bucket...');
  const { error } = await supabase.storage.createBucket(bucketName, {
    public: false,
  });

  if (error) {
    console.error('Error creating the Supabase bucket');
    console.error(error);
  }
})();
