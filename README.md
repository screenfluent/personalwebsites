# Personal Websites Directory

A curated list of personal websites from around the world. Built with Svelte 5 and hosted on Cloudflare Pages.

## About

This project aims to showcase personal websites from developers, designers, and creators worldwide. It started as a personal challenge to overcome perfectionism and ship quickly, and has evolved into an open-source directory where anyone can contribute.

## Adding Your Website

To add your website to the directory:

1. Fork this repository
2. Add your avatar image to the `static/avatars/` directory
   - Image should be square, no bigger than 400x400px
   - Name the file using your domain name (e.g., `example-com.jpg`)
   - PNG or JPG formats accepted
3. Add your website entry to `data/websites.json`
   ```json
   {
     "name": "Your Name",
     "avatar": "/avatars/your-image.jpg",
     "url": "https://your-website.com",
     "country": {
       "code": "PL",
       "flag": "🇵🇱",
       "name": "Poland"
     }
   }
   ```
   Note: For location, you can also use:
   - Earth: `{"code": "EARTH", "flag": "🌍", "name": "Earth"}`
   - Digital Nomad: `{"code": "NOMAD", "flag": "🌎", "name": "Digital Nomad"}`

4. Create a pull request

## Development

This project uses:
- Svelte 5
- TypeScript
- TailwindCSS 4.0
- Cloudflare Pages

### Local Setup

```bash
# Clone the repository
git clone https://github.com/screenfluent/personalwebsites 
cd personalwebsites

# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
```

## Visit

[personalwebsites.org](https://personalwebsites.org)

## License

MIT License - feel free to use this project as inspiration for your own directory!