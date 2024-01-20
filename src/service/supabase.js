import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://mzfvyghqroaicmtfdisw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16ZnZ5Z2hxcm9haWNtdGZkaXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2ODY0MjIsImV4cCI6MjAyMTI2MjQyMn0.l-FSkFo1_DtKAUJqajd-ESBRkHOwh5d8fU52fdYQvcY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
