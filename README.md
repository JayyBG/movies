# ![Ripper Stream](https://cdn.ripper.lol/media/streaming-screenshot-1-2023-03-17.png)

## 🔗 Links
- **[Discord](https://ripper.lol/discord.html)**
- **[ripper.lol](https://ripper.lol)**

## 🖥️ Requirements
- Web server that supports Node.js
- Reverse proxy to enable SSL (nginx, etc.)
- [cloudpanel.io](https://cloudpanel.io) Recommended for easiest & fastest setup

## 📂 Download

1. Install Git on your system if you haven't already.
2. Run `git clone https://git.ripper.lol/ripper/Stream-API.git`
3. You may need to authenticate using your username and password.

## 🔧 Setup
1. Install Node.js if you haven't already from [nodejs.org](https://nodejs.org)
2. Download the script using instructions above.
3. Open a terminal in the script directory.
4. Run `npm install` to install dependencies.
5. Duplicate the `.example.env` file and rename `.env`
6. Update `.env` with your own values.
7. Run `npm run dev` to start the dev server, API will be available on port `3000`
8. Ensure everything is functioning correctly.
9. Run `npm build` to build the production-ready script.
10. Upload all files to your server excluding `node_modules`
11. Go to the uploaded folder path in your server terminal.
12. Run `npm install` then `npm start` to start the production API.
13. **(Optional)** Setup your reverse proxy to `127.0.0.1:3000`