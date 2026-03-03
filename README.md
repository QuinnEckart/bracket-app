# Tournament Bracket Builder

A March Madness style tournament bracket application where you can:

- **Drag and drop images** from your computer onto any seed position
- **Name the 4 regions** (conferences) by clicking on the region title
- **Select winners** by clicking on teams in each matchup
- **Track advancement** through the entire bracket to crown a champion

## Features

- 🏀 Full 64-team bracket with 4 regions
- 🖼️ Drag-and-drop image upload for teams
- ✏️ Editable team names and region names
- 💾 Auto-saves to browser localStorage
- 📱 Responsive design
- 🎨 Beautiful dark theme with tournament styling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/bracket-app.git
cd bracket-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## How to Use

### 1. Set Up Your Seeds

1. Click **"Edit Seeds"** on any region
2. Drag images from your computer onto seed slots, OR click a slot to browse for an image
3. Double-click team names to edit them
4. Click **"Show Bracket"** to return to bracket view

### 2. Name Your Regions

Click on any region name (East, West, South, Midwest) to edit it.

### 3. Pick Winners

1. Click on a team in any matchup to select them as the winner
2. Winners automatically advance to the next round
3. Continue through the bracket until you have a champion!

### 4. Reset

Click **"Reset Bracket"** to start over with a fresh bracket.

## Deploy to DigitalOcean App Platform

### Option 1: Deploy Button (Recommended)

1. Push this repo to your GitHub account
2. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
3. Click **"Create App"**
4. Select your GitHub repository
5. DigitalOcean will auto-detect the static site configuration
6. Click **"Deploy"**

### Option 2: Using doctl CLI

```bash
# Install doctl if not already installed
# https://docs.digitalocean.com/reference/doctl/how-to/install/

# Authenticate
doctl auth init

# Create the app
doctl apps create --spec .do/app.yaml
```

### Option 3: Manual Configuration

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Create a new app from your GitHub repo
3. Configure as **Static Site**:
   - Build Command: `npm run build`
   - Output Directory: `dist`

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **localStorage** - Persistence

## Project Structure

```
bracket-app/
├── public/
│   └── bracket.svg          # App icon
├── src/
│   ├── components/
│   │   ├── Header.tsx       # App header with reset button
│   │   ├── TeamSlot.tsx     # Drag-drop team card
│   │   ├── MatchupCard.tsx  # Single matchup display
│   │   ├── RegionBracket.tsx # Full region with 4 rounds
│   │   └── FinalFour.tsx    # Final four + championship
│   ├── hooks/
│   │   └── useBracket.ts    # State management
│   ├── types.ts             # TypeScript types
│   ├── utils.ts             # Helper functions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── .do/
│   └── app.yaml             # DigitalOcean App Platform config
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## License

MIT
