# Personal Websites Directory

A curated list of personal websites from around the world. Built with Svelte 5 and hosted on Cloudflare Pages.

## About

This project aims to showcase personal websites from developers, designers, and creators worldwide. It started as a personal challenge to overcome perfectionism and ship quickly, and has evolved into an open-source directory where anyone can contribute.

## Adding Your Website

To add your website to the directory:

1. Fork this repository
2. Add your avatar image to the `static/avatars/` directory
   - Image should be square, at least 400x400px
   - Name the file using your domain name (e.g., `example-com.jpg`)
3. Add your website entry to `data/websites.json`
   ```json
   {
     "name": "Your Name",
     "avatar": "/avatars/your-image.jpg",
     "url": "https://your-website.com",
     "country": {
       "code": "US",
       "flag": "🇺🇸",
       "name": "United States"
     }
   }
   ```
4. Create a pull request

## Development

This project uses:
- Svelte 5
- TypeScript
- TailwindCSS
- Cloudflare Pages

### Local Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/personalwebsites.org
cd personalwebsites.org

# Install dependencies
npm install

# Start development server
npm run dev
```

## License

MIT License - feel free to use this project as inspiration for your own directory!
