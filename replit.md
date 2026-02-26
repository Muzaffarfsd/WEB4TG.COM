# WEB4TG.COM

## Overview
A Node.js/Express web application serving static content on port 5000.

## Architecture
- **Runtime**: Node.js 20
- **Framework**: Express 5
- **Port**: 5000
- **Entry point**: `server.js`
- **Static files**: `public/` directory

## Project Structure
```
server.js          - Express server entry point
public/
  index.html       - Main HTML page
  style.css        - Stylesheet
package.json       - Node.js project config
```

## Running
```bash
node server.js
# or
npm start
```

## Deployment
Configured for autoscale deployment via `node server.js`.
