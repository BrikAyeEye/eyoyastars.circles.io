# Eyoyastars - Aether Chart

Astrological chart calculator with personalized insights.

## GitHub Pages Setup

This repository is configured for GitHub Pages with custom domain `eyoyastars.circles.io`.

### Setup Instructions

1. **Repository Setup:**
   - Repository name: `eyoyastars.circles.io`
   - GitHub Pages source: `main` branch, `/` (root) folder

2. **Custom Domain:**
   - CNAME file is already configured with `eyoyastars.circles.io`
   - In GitHub Pages settings, enable "Custom domain" and enter: `eyoyastars.circles.io`

3. **DNS Configuration:**
   - Add CNAME record in circles.io DNS:
     - Name: `eyoyastars`
     - Type: `CNAME`
     - Value: `brikayeeye.github.io`
   - Wait for DNS propagation (can take up to 48 hours)

4. **SSL Certificate:**
   - GitHub will automatically provision SSL certificate once DNS is configured
   - Check "Enforce HTTPS" in GitHub Pages settings

### Files Structure

- `index.html` - Main application
- `chart.js` - Chart calculation and rendering
- `CNAME` - Custom domain configuration
- `*.json` - Content libraries and data
- `boom_sentences_final.json` - Validated boom screen sentences

### Local Development

Run a local server to test:
```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# Or use the PowerShell script
.\start_local_server.ps1
```

Then visit: `http://localhost:8000`

### Deployment

Push to `main` branch and GitHub Pages will automatically deploy.

