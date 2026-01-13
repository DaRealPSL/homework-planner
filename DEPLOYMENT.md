# Deployment Guide

This guide will walk you through deploying the Student Homework Planner application to production.

## Prerequisites

- Completed development setup
- Supabase project configured
- Git repository initialized
- Environment variables configured

## Step 1: Supabase Production Setup

### 1.1 Create Production Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a strong password and save it securely
3. Wait for the project to initialize (this may take a few minutes)

### 1.2 Configure Database

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Run the entire SQL script
4. Verify all tables were created successfully

### 1.3 Configure Storage

1. Navigate to Storage in the Supabase dashboard
2. Click "Create bucket"
3. Configure the bucket:
   - Name: `attachments`
   - Public: Yes
   - File size limit: 10MB
   - Allowed MIME types: `image/*`, `application/pdf`

### 1.4 Configure Authentication

1. Go to Authentication > Settings
2. Configure email templates if desired
3. Enable/disable auth providers as needed
4. Set up email provider (recommended for production)

### 1.5 Update Environment Variables

Update your `.env` file with production Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

## Step 2: Build and Test Locally

### 2.1 Install Dependencies

```bash
npm install
```

### 2.2 Build the Application

```bash
npm run build
```

### 2.3 Test the Build

```bash
npm run preview
```

Verify that:
- All pages load correctly
- Authentication works
- Calendar displays properly
- File uploads work
- Realtime features function

## Step 3: Deploy to Vercel (Recommended)

### 3.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure the project:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 3.2 Configure Environment Variables

Add the following environment variables in Vercel:
- `VITE_SUPABASE_URL`: Your production Supabase URL
- `VITE_SUPABASE_ANON_KEY`: Your production anon key

### 3.3 Deploy

Click "Deploy" and wait for the build to complete.

### 3.4 Verify Deployment

- Visit your deployed URL
- Test all functionality
- Check console for any errors

## Step 4: Deploy to Netlify (Alternative)

### 4.1 Connect Repository

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### 4.2 Configure Environment Variables

Add the same environment variables as in Vercel deployment.

### 4.3 Deploy

Click "Deploy site" and wait for deployment to complete.

## Step 5: Post-Deployment Configuration

### 5.1 Configure Supabase Auth

1. Go to Authentication > URL Configuration
2. Set the site URL to your deployed application URL
3. Add any additional redirect URLs if needed

### 5.2 Test Production Environment

1. Create a test account
2. Join with a class code
3. Create homework assignments
4. Upload files
5. Verify realtime updates work
6. Test on mobile devices

### 5.3 Monitor Application

Set up monitoring for:
- Error tracking (consider Sentry)
- Performance monitoring
- User analytics

## Step 6: Domain Configuration (Optional)

### 6.1 Custom Domain on Vercel

1. Go to project settings
2. Add custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate to be issued

### 6.2 Custom Domain on Netlify

1. Go to Domain management
2. Add custom domain
3. Configure DNS as instructed
4. Wait for SSL certificate

## Step 7: Email Configuration (Optional)

For email notifications, set up an email provider:

1. Choose an email service (SendGrid, Resend, etc.)
2. Configure in Supabase project settings
3. Update email templates
4. Test email delivery

## Step 8: Performance Optimization

### 8.1 Enable Compression

Vercel and Netlify handle compression automatically.

### 8.2 Optimize Images

- Use WebP format when possible
- Implement lazy loading
- Set appropriate cache headers

### 8.3 Bundle Analysis

```bash
npm run build -- --analyze
```

Check for large dependencies and optimize as needed.

## Step 9: Security Hardening

### 9.1 Environment Variables

- Never commit `.env` files
- Use different keys for development and production
- Rotate keys periodically

### 9.2 CORS Configuration

Configure CORS policies in Supabase for your production domain.

### 9.3 Rate Limiting

Consider implementing rate limiting for API calls.

## Step 10: Backup and Recovery

### 10.1 Database Backups

Supabase handles automatic backups, but consider:
- Setting up additional backup schedules
- Testing recovery procedures
- Documenting backup retention policies

### 10.2 Application Backup

- Keep your Git repository backed up
- Document deployment procedures
- Store environment variable backups securely

## Troubleshooting Deployment Issues

### Common Issues

1. **Build fails**: Check Node.js version and dependencies
2. **Environment variables not working**: Verify variable names and values
3. **Supabase connection fails**: Check URL and anon key
4. **File uploads fail**: Verify storage bucket configuration
5. **Realtime not working**: Check RLS policies and subscriptions

### Debug Mode

Enable debug mode by adding to environment variables:
```env
VITE_DEBUG=true
```

### Logs

Check deployment platform logs for detailed error information.

## Maintenance

### Regular Tasks

1. Monitor application performance
2. Update dependencies regularly
3. Review security policies
4. Backup data
5. Monitor usage analytics

### Updates

When updating the application:
1. Test changes in development
2. Deploy to staging environment if available
3. Deploy to production with minimal downtime
4. Monitor for issues after deployment

## Support

For deployment issues:
1. Check platform-specific documentation
2. Review Supabase documentation
3. Search existing issues
4. Contact support if needed

---