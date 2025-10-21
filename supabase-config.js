// Supabase configuration
const supabaseUrl = 'https://utsohlqsnojqlouzmouu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0c29obHFzbm9qcWxvdXptb3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNDgyMTEsImV4cCI6MjA3NjYyNDIxMX0.zKK9BVX9Yx8Yo-TCet-bVvftfChXVQaoR061fUWMmb8';

// Create Supabase client
export const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

console.log('Supabase initialized');