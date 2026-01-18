# Student Homework Planner & Share

> ### ⚖️ License note
>
> This repository is **Source-Available** under the **STUDIFLOW SOURCE-AVAILABLE LICENSE**. It is free for personal, educational, and local experimentation. **Commercial use, hosting it as a service, or redistributing it as a competing product is strictly prohibited.** See `./LICENSE` for the full legal terms.  
> By contributing you accept the contribution terms described in `CONTRIBUTING.md`.

A real-time collaborative homework management system where students in the same class can jointly track assignments, share solutions via images/files, and manage deadlines through an intuitive calendar interface.

## Features

- **Class Code Gateway**: Secure access via class code validation
- **Real-time Collaboration**: All changes sync instantly across class members
- **Calendar Interface**: Google Calendar-style month view with homework indicators
- **File Sharing**: Upload and share images and PDFs for homework solutions
- **Completion Tracking**: Personal completion status for each assignment
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Vite + React (TSX) + TypeScript + TailwindCSS  
- **Backend**: Supabase (Auth, PostgreSQL, Realtime, Storage) — *note: the hosted backend infrastructure and production credentials are proprietary and not included in this repo*  
- **State Management**: React hooks with Supabase subscriptions  
- **Hosting**: Vercel / Netlify (static frontend deployment)

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
````

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com).
2. In the SQL Editor run the migration script from `supabase/migrations/001_initial_schema.sql`.
3. Enable Row Level Security (RLS) for the tables used (migration includes RLS policies).
4. Create a storage bucket named `attachments`:

   * Go to Storage > Create bucket
   * Name: `attachments`
   * Public: Yes (access controlled via RLS policies and signed URLs)
   * File size limit: 10MB
   * Allowed MIME types: `image/*`, `application/pdf`

**Security note:** Do **not** commit your `.env` or any secrets to the repository. Use environment variables in your hosting provider or a secrets management tool.

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
4. Add environment variables from your `.env` (on Vercel)
5. Deploy

### Netlify

1. Connect your repository to Netlify
2. Set the build command: `npm run build`
3. Set the publish directory: `dist`
4. Add environment variables
5. Deploy

## Database Schema

### Tables

* **classes**: Class information with unique codes
* **profiles**: User profiles linked to classes
* **homework**: Homework assignments
* **homework_attachments**: File attachments for homework
* **homework_completion**: Per-user completion tracking

### Class Code Format

Class codes must follow the format: `^[0-9]{1,2}[A-Z]{2,3}[0-9]{1,2}$`

Examples:

* `3HT2` - Grade 3, HAVO Tweetalig, Class 2
* `4V1A` - Grade 4, VWO, Class 1, Group A
* `2MA3` - Grade 2, MAVO, Class 3

## Security

### Row Level Security (RLS)

The application uses Supabase RLS to ensure:

* Users can only access data from their own class
* Users can only modify their own data
* File uploads are validated and access is controlled via signed URLs

### Authentication

* Supabase Auth with email/password and magic link
* Session persistence with localStorage
* Automatic profile creation on signup

## Testing Real-time Features

1. Open the application in two different browser windows
2. Log in with different accounts (same class code)
3. Create a homework assignment in one window
4. Verify it appears instantly in the other window
5. Test file uploads and completion toggling

## File Upload Configuration

### Supported File Types

* Images: JPEG, PNG, WebP
* Documents: PDF
* Maximum file size: 10MB per file

### Storage Security

* Files are stored in Supabase Storage
* Signed URLs with 1-hour expiry for secure access
* Public bucket access is controlled via RLS and signed URLs

## API Endpoints

The application uses Supabase's client library and does not require custom API endpoints for the common flows. All data operations go through Supabase's APIs.

## Troubleshooting

### Common Issues

1. **Class code not found**: Ensure the class code exists in the `classes` table
2. **File upload fails**: Check storage bucket configuration and file size limits
3. **Realtime not working**: Verify RLS policies and Supabase subscription setup
4. **Authentication issues**: Check Supabase Auth settings and email templates

### Debug Mode

Set `VITE_DEBUG=true` in your `.env` file to enable debug logging.

## Contributing

**Important:** This project is *not* OSI open-source. It is source-available with non-commercial restrictions. By contributing you accept the contribution license terms.

1. Fork this repository **only for personal, educational, or non-commercial use**. Public forks must include the `LICENSE` file and remain under the same license. Re-licensing or using forks to operate a competing hosted service is prohibited.
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes and include tests when applicable
4. Add a commit sign-off: include a DCO-style line in your commit/PR description:

   ```
   Signed-off-by: <Your Full Name> <your.email@example.com>
   ```

   This indicates you grant the Author the rights to use the contribution under the project license.
5. Submit a pull request describing the change and including the sign-off.
6. The maintainers will review and merge at their discretion.

If you need to contribute but cannot sign off, open an issue or contact the maintainer before submitting code.

## License

This repository is **source-available**. See `./LICENSE` for the full STUDIFLOW SOURCE-AVAILABLE LICENSE (non-commercial). This is **not** an OSI-approved open-source license.

If you require a commercial license, contact: **[pepijnl.snoeren0@gmail.com](mailto:pepijnl.snoeren0@gmail.com)**

## Support

For issues and questions:

1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information (include browser, Supabase config, and steps to reproduce)

---

Built with ❤️ using React, TypeScript, and Supabase.