# Development Context - Pilakon Motion Comic Platform

## Project Overview
- **Project Name:** Pilakon
- **Version:** 1.0 MVP
- **Current Phase:** Phase 1 - Core Features (Months 1-3)
- **Last Updated:** January 2025
- **PRD Reference:** [docs/PRD.md](./docs/PRD.md)

## Current State
- **Development Status:** MVP Development
- **Active Epic:** Asset Management System
- **Next Milestone:** Basic panel creation and asset library integration
- **Team:** AI Agent Development Team

## Key Architecture Decisions
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Frontend:** SvelteKit with TypeScript
- **Styling:** Tailwind CSS
- **Package Manager:** pnpm
- **Build Tool:** Vite
- **Hosting:** Docker containerization ready
- **Approach:** Progressive Web App (PWA)

## Technical Stack Details
### Database (Supabase PostgreSQL)
- **Authentication:** Supabase Auth with Row Level Security (RLS)
- **Storage:** Supabase Storage for asset management
- **Real-time:** Supabase Realtime for collaboration features
- **Current Schema:** 
  - `comics` table with user ownership
  - `panels` table with cascade deletion
  - RLS policies implemented for user data protection

### Frontend (SvelteKit)
- **Framework:** SvelteKit with TypeScript
- **State Management:** Svelte stores
- **Animations:** CSS transitions + Svelte transitions
- **UI Components:** Custom components with Tailwind CSS
- **Icons:** Lucide Svelte
- **Drag & Drop:** svelte-dnd-action

## Performance Targets (from PRD)
- **Page Load:** < 3 seconds
- **Time to Interactive:** < 5 seconds
- **Lighthouse Score:** > 90
- **Core Web Vitals:** All green
- **Mobile Performance:** Optimized for 3G networks

## User Personas (from PRD)
1. **Sarah, Marketing Professional (32)**
   - Needs: Quick, professional visual content
   - Pain Points: Limited design skills, time constraints
   - Goals: Engaging social media content

2. **Mike, Educator (42)**
   - Needs: Interactive educational materials
   - Pain Points: Static content doesn't engage students
   - Goals: Immersive learning experiences

3. **Alex, Creative Writer (28)**
   - Needs: Visual storytelling platform
   - Pain Points: Can't draw, expensive illustrators
   - Goals: Bring stories to life visually

## Current Focus Areas (Phase 1 MVP)
### High Priority Features
1. **Asset Management System** (PRD Section 4.1)
   - Sticker library with categories
   - Image upload support (PNG, JPG, WebP, SVG)
   - Search and filter functionality
   - Asset preview and favorites

2. **Panel Creation & Customization** (PRD Section 4.2)
   - Multiple panel sizes (full, half, one-third width)
   - Responsive layouts
   - Custom dimensions and templates
   - Layer management

3. **Text & Speech Balloons** (PRD Section 4.3)
   - Multiple balloon types (speech, thought, narration)
   - Positioning options
   - Styling and animation options
   - Text formatting

4. **Basic Scroll Transitions** (PRD Section 4.4)
   - Scroll triggers for panel reveals
   - Basic transition types (fade, slide, zoom)
   - Timing controls
   - Performance optimization

5. **Comic Reader Experience** (PRD Section 4.5)
   - Vertical scroll reading mode
   - Navigation and progress tracking
   - Basic sharing functionality
   - PWA capabilities

6. **User Authentication** (PRD Section 4.6)
   - Email authentication via Supabase
   - User profiles and management
   - Basic publishing (public/private)

## Technical Constraints & Considerations
- **Browser Support:** Modern browsers (ES2020+)
- **Mobile First:** Responsive design for 320px+ screens
- **Accessibility:** WCAG 2.1 AA compliance required
- **Security:** RLS policies for user data protection
- **Performance:** Lazy loading, image optimization, CDN integration
- **Offline Support:** PWA with service workers

## Development Environment
- **Local Development:** Docker Compose setup available
- **Database:** Supabase cloud instance
- **Environment Variables:** Required for Supabase integration
- **Build Process:** Vite with SvelteKit adapter-node

## Key Dependencies
- **@supabase/supabase-js:** ^2.57.2
- **@supabase/auth-helpers-sveltekit:** ^0.12.0
- **svelte-dnd-action:** ^0.9.65 (drag and drop)
- **lucide-svelte:** ^0.542.0 (icons)
- **tailwindcss:** ^3.4.17

## Success Metrics (Phase 1)
- **User Registration:** 100 beta users
- **Content Creation:** 50 comics published
- **Performance:** 90+ Lighthouse score
- **User Satisfaction:** 4.0+ star rating

## Next Steps
1. Complete asset management system implementation
2. Build panel creation interface
3. Implement text balloon system
4. Add basic scroll transitions
5. Create comic reader experience
6. Set up user authentication flows

## Notes & Decisions Log
- **Database Design:** Chose UUID primary keys for better security
- **File Storage:** Using Supabase Storage for asset management
- **Authentication:** Supabase Auth with RLS for security
- **Styling:** Tailwind CSS for rapid development and consistency
- **Containerization:** Docker setup for easy deployment

---
**Document Status:** Active Development
**Next Review:** Weekly during development
**Maintained By:** Development Team
