# ![Ripper Stream](https://cdn.ripper.lol/media/streaming-screenshot-1-2023-03-17.png)

## 🔗 Links
- **[Discord](https://ripper.lol/discord.html)**
- **[ripper.lol](https://ripper.lol)**

## 🖥️ Requirements
- Static Web Hosting (Netlify, GitHub Pages, etc.)

## 📂 Download

1. Install Git on your system if you haven't already.
2. Run `git clone https://git.ripper.lol/ripper/Stream.git`

## 🔧 Setup
1. Install Node.js if you haven't already from [nodejs.org](https://nodejs.org)
2. Download the script using instructions above.
3. Open a terminal in the script directory.
4. Run `npm install` to install dependencies, then `npm run dev` to start the dev server.
5. Open `http://localhost:5173` in your browser.
6. **(Optional)** Change the site logo by uploading a png file to `/public/assets` and naming it `logo.png`
7. **(Optional)** Change the main color of the site by opening `/src/styles/main.scss` and editing the line with `$primary-color: ...;`
8. **(Optional)** Change the config in `/src/config.ts` and change the site name in `/index.html`
9. **(Optional)** Add any advertisement codes in `/index.html` (Adsterra, Clickadu, etc.)
10. Run `npm run build` in the terminal to build the production files
11. Upload the contents of the `/dist` folder to your web hosting.