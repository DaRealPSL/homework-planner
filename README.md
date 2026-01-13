# Student Homework Planner & Share

A real-time collaborative homework management system where students in the same class can jointly track assignments, share solutions via images/files, and manage deadlines through an intuitive calendar interface.

## Features

- **Class Code Gateway**: Secure access via class code validation
- **Real-time Collaboration**: All changes sync instantly across all class members
- **Calendar Interface**: Google Calendar-style month view with homework indicators
- **File Sharing**: Upload and share images and PDFs for homework solutions
- **Completion Tracking**: Personal completion status for each assignment
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Vite + React (TSX) + TypeScript + TailwindCSS
- **Backend**: Supabase (Auth, PostgreSQL, Realtime, Storage)
- **State Management**: React hooks with Supabase subscriptions
- **Hosting**: Vercel/Netlify (static deployment)

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Git (for version control)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd homework-planner
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the migration script from `supabase/migrations/001_initial_schema.sql`
3. Enable Row Level Security (RLS) for all tables (already included in the migration)
4. Create a storage bucket named `attachments`:
   - Go to Storage > Create bucket
   - Name: `attachments`
   - Public: Yes
   - File size limit: 10MB
   - Allowed MIME types: `image/*`, `application/pdf`

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under API.

### 4. Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set the build command: `npm run build`
3. Set the output directory: `dist`
4. Add environment variables from your `.env` file
5. Deploy

### Netlify

1. Connect your repository to Netlify
2. Set the build command: `npm run build`
3. Set the publish directory: `dist`
4. Add environment variables
5. Deploy

## Database Schema

### Tables

- **classes**: Class information with unique codes
- **profiles**: User profiles linked to classes
- **homework**: Homework assignments
- **homework_attachments**: File attachments for homework
- **homework_completion**: Per-user completion tracking

### Class Code Format

Class codes must follow the format: `^[0-9]{1,2}[A-Z]{2,3}[0-9]{1,2}$`

Examples:
- `3HT2` - Grade 3, HAVO Tweetalig, Class 2
- `4V1A` - Grade 4, VWO, Class 1, Group A
- `2MA3` - Grade 2, MAVO, Class 3

## Security

### Row Level Security (RLS)

The application uses Supabase's RLS to ensure:
- Users can only access data from their own class
- Users can only modify their own data
- File uploads are secured and validated

### Authentication

- Supabase Auth with email/password and magic link
- Session persistence with localStorage
- Automatic profile creation on signup

## Testing Realtime Features

1. Open the application in two different browser windows
2. Log in with different accounts (same class code)
3. Create a homework assignment in one window
4. Verify it appears instantly in the other window
5. Test file uploads and completion toggling

## File Upload Configuration

### Supported File Types
- Images: JPEG, PNG, WebP
- Documents: PDF
- Maximum file size: 10MB per file

### Storage Security
- Files are stored in Supabase Storage
- Signed URLs with 1-hour expiry for secure access
- Public bucket with RLS policies for access control

## API Endpoints

The application uses Supabase's client library and doesn't require custom API endpoints. All data operations go through Supabase's API.

## Troubleshooting

### Common Issues

1. **Class code not found**: Ensure the class code exists in the `classes` table
2. **File upload fails**: Check storage bucket configuration and file size limits
3. **Realtime not working**: Verify RLS policies and subscription setup
4. **Authentication issues**: Check Supabase Auth settings and email templates

### Debug Mode

Set `VITE_DEBUG=true` in your `.env` file to enable debug logging.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information

---

Built with ❤️ using React, TypeScript, and Supabase.