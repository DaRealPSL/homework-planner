#!/bin/bash

# Folder Structure Reorganization Script
# This script reorganizes the homework-planner project into a feature-based structure

echo "🚀 Starting folder structure reorganization..."

# Create new directory structure
echo "📁 Creating new folder structure..."

mkdir -p src/core/{config,lib,types}
mkdir -p src/features/{auth,homework,calendar,announcements,notifications,reminders,search,security,session,settings,attachments}/{components,hooks,utils,types}
mkdir -p src/shared/{components/ui,components/layout,hooks,utils}

# Move core files
echo "📦 Moving core files..."
mv src/lib/supabase.ts src/core/lib/ 2>/dev/null || true
mv types/database.ts src/core/types/ 2>/dev/null || true

# Move auth feature
echo "🔐 Moving auth feature..."
mv src/components/AuthGate.tsx src/features/auth/components/ 2>/dev/null || true
mv src/components/ClassCodeEntry.tsx src/features/auth/components/ 2>/dev/null || true
mv src/hooks/useAuth.ts src/features/auth/hooks/ 2>/dev/null || true

# Move homework feature
echo "📚 Moving homework feature..."
mv src/components/HomeworkForm.tsx src/features/homework/components/ 2>/dev/null || true
mv src/hooks/useRealtimeHomeworks.ts src/features/homework/hooks/useRealtimeHomework.ts 2>/dev/null || true

# Move calendar feature
echo "📅 Moving calendar feature..."
mv src/components/CalendarView.tsx src/features/calendar/components/ 2>/dev/null || true
mv src/components/DaySidebar.tsx src/features/calendar/components/ 2>/dev/null || true
mv src/components/TodayView.tsx src/features/calendar/components/ 2>/dev/null || true

# Move announcements feature
echo "📢 Moving announcements feature..."
mv src/components/AnnouncementBoard.tsx src/features/announcements/components/ 2>/dev/null || true

# Move notifications feature
echo "🔔 Moving notifications feature..."
mv src/components/NotificationsSystem.tsx src/features/notifications/components/ 2>/dev/null || true

# Move reminders feature
echo "⏰ Moving reminders feature..."
mv src/components/HomeworkReminders.tsx src/features/reminders/components/ 2>/dev/null || true

# Move search feature
echo "🔍 Moving search feature..."
mv src/components/SearchFilterBar.tsx src/features/search/components/ 2>/dev/null || true

# Move security feature
echo "🔒 Moving security feature..."
mv src/components/PasswordStrength.tsx src/features/security/components/PasswordStrengthMeter.tsx 2>/dev/null || true
mv src/components/RateLimiting.tsx src/features/security/components/ 2>/dev/null || true
mv src/components/ReportModal.tsx src/features/security/components/ 2>/dev/null || true

# Move session feature
echo "👤 Moving session feature..."
mv src/components/SessionManagement.tsx src/features/session/components/ 2>/dev/null || true

# Move settings feature
echo "⚙️ Moving settings feature..."
mv src/components/SettingsPage.tsx src/features/settings/components/ 2>/dev/null || true
mv src/components/PrivacyPolicy.tsx src/features/settings/components/ 2>/dev/null || true
mv src/components/TermsOfService.tsx src/features/settings/components/ 2>/dev/null || true

# Move attachments feature
echo "📎 Moving attachments feature..."
mv src/components/AttachmentGallery.tsx src/features/attachments/components/ 2>/dev/null || true
mv src/hooks/useAttachments.ts src/features/attachments/hooks/ 2>/dev/null || true

# Move shared components
echo "🎨 Moving shared components..."
mv src/components/LoadingSpinner.tsx src/shared/components/ui/ 2>/dev/null || true
mv src/components/LoadingSkeletons.tsx src/shared/components/ui/ 2>/dev/null || true
mv src/components/DarkModeToggle.tsx src/shared/components/ui/ 2>/dev/null || true
mv src/components/MainApp.tsx src/shared/components/layout/ 2>/dev/null || true

# Move shared hooks
echo "🪝 Moving shared hooks..."
mv src/hooks/KeyboardShortcuts.tsx src/shared/hooks/useKeyboardShortcuts.ts 2>/dev/null || true

# Clean up old directories
echo "🧹 Cleaning up old directories..."
rmdir src/components 2>/dev/null || echo "  ℹ️  src/components not empty yet"
rmdir src/hooks 2>/dev/null || echo "  ℹ️  src/hooks not empty yet"
rmdir src/lib 2>/dev/null || echo "  ℹ️  src/lib not empty yet"
rmdir types 2>/dev/null || echo "  ℹ️  types not empty yet"

echo "✅ Folder structure reorganization complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Review the new structure in src/"
echo "  2. Update import paths in all files"
echo "  3. Create index.ts files for each feature"
echo "  4. Test the application"
echo ""
echo "💡 Tip: Use your IDE's 'Find and Replace' to update import paths"