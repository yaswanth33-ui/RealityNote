// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nmqpvuprtwrraevymxxv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcXB2dXBydHdycmFldnlteHh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3ODM0MzMsImV4cCI6MjA1NzM1OTQzM30.OO507hG3idB190PRFxU_sAEu0shrgC_gtue6w_VtPII";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);