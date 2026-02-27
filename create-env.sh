#!/bin/bash

# Script to create .env file with Supabase credentials

cat > .env << 'EOF'
VITE_SUPABASE_URL=https://ytjfqvconchgbcnrkcyg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0amZxdmNvbmNoZ2JjbnJrY3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzU5NjQsImV4cCI6MjA3OTcxMTk2NH0.QH-kPwquKx9W0Og6MLYsI80TPaekfpAckVM4G2NK3Gw
EOF

echo "✅ .env file created successfully!"
echo "📝 Make sure to restart your dev server if it's running."

