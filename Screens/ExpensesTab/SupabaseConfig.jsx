
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
     'https://lzodflpxnnuwuwoocmep.supabase.co',
     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6b2RmbHB4bm51d3V3b29jbWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEwMTgwOTksImV4cCI6MjAzNjU5NDA5OX0.GZhGxnym6eqJZOS8KA_kDEV8P1knkt0AgGkg-jTsECY')
        