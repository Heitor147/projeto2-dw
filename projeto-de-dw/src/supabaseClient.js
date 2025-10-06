import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://raecevenegtqiecrbtzm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhZWNldmVuZWd0cWllY3JidHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDgwNzQsImV4cCI6MjA3NDEyNDA3NH0.sfY8Hxm2pqVk8GjxhOFUsLLHHaGGvQNnc_xgh78bCno';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);