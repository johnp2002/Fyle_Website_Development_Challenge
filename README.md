# GitHub Repositories Listing

## Overview
This web application displays public GitHub repositories for a specified user. It allows users to view repositories, navigate through pages using server-side pagination, and search for repositories. The application is built using HTML, CSS, and JavaScript.

## Features
- Display public GitHub repositories for a user.
- Server-side pagination with 10 repositories per page (configurable up to 100).
- Loading indicators during API calls.
- Optional search bar to filter repositories.

## Tech Stack
- HTML
- CSS (Bootstrap for styling)
- JavaScript

## How to Run Locally
1. Clone this repository to your local machine.
2. Open `index.html` in a web browser.

## Configuration
- Edit `script.js` to change the GitHub username and API token.
- API token is required for authentication. Replace the placeholder token with your actual GitHub token.

```javascript
const username = 'your-github-username';
const token = 'your-github-token';
