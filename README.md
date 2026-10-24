# Opeyemi & Temilayojesu - Digital Wedding Invitation

A web application built for the wedding celebration of Opeyemi & Temilayojesu (#EVERAFTER21').

## Overview

This repository contains the interactive digital wedding invitation for Opeyemi & Temilayojesu's wedding at Green Life Event Center, Oregun, Ikeja, Lagos on Saturday, 21st November 2026.

The platform features an interactive OT-branded envelope cover, event scheduling and venue details, mint-green and plum dress-code guidance, live guest photo sharing with Supabase Storage, gift-card pledge tracking, optional bank-transfer details, and an integrated WhatsApp RSVP system.

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: CSS3 with CSS Variables
- **Icons**: Lucide React
- **Backend Services**: Supabase (Database & Storage)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation & Development

1. Clone the repository:
   ```bash
   git clone git@github.com:vintage-creator/digital-wedding-invite.git
   cd digital-wedding-invite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

To create a production build:

```bash
npm run build
```

The compiled output will be generated in the `dist` directory.

### Wedding-specific configuration

Copy `.env.example` to a local environment file and provide the Supabase values. The music player is configured for “Unbreakable” by Westlife and expects a licensed audio file at `/public/assets/unbreakable-westlife.mp3`, or a URL supplied through `VITE_WEDDING_MUSIC_URL`. Bank-transfer fields are intentionally blank until the couple provides current details.

## License

Private repository for Opeyemi & Temilayojesu's Wedding Celebration.
