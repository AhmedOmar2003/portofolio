/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ghdwrskspfzewnqefwbe.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZHdyc2tzcGZ6ZXducWVmd2JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5Nzk3MDgsImV4cCI6MjA4ODU1NTcwOH0.QcTlfWgqggEC9SEvY75mRZxNBcn2WO59GFdbagpBZTI'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkUser() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'ahmedessam.uiux@gmail.com',
    password: 'password123' // Just trying a dummy one to see the specific error
  })
  
  console.log('Login attempt result:', { data, error: error?.message })
}

checkUser()
