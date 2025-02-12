import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Country {
  code: string;
  flag: string;
  name: string;
}

interface Website {
  name: string;
  screenshot: string;
  url: string;
  country: Country;
  added: string; // ISO date string
}

interface WebsitesData {
  websites: Website[];
}

interface IssueData {
  title: string;
  body: string;
}

// Funkcja do wyciągania kodu kraju i emoji flagi
function getCountryInfo(location: string): Country {
  const [name, flag] = location.split(' ');
  const code = name.toUpperCase();
  
  if (name === 'Earth') {
    return { code: 'EARTH', flag: '🌍', name: 'Earth' };
  }
  if (name === 'Digital') {
    return { code: 'NOMAD', flag: '🌎', name: 'Digital Nomad' };
  }
  
  return { code, flag, name };
}

// Funkcja do generowania wpisu
function generateWebsiteEntry(name: string, url: string, location: string): Website {
  const country = getCountryInfo(location);
  const domain = new URL(url).hostname;
  
  return {
    name,
    screenshot: `/screenshots/${domain}.webp`,
    url: url.replace(/\/$/, ''), // usuwa trailing slash
    country,
    added: new Date().toISOString()
  };
}

// Funkcja do dodawania wpisu do pliku JSON
function addWebsiteToJson(entry: Website): void {
  const jsonPath = join(process.cwd(), 'static/data/websites.json');
  const data = JSON.parse(readFileSync(jsonPath, 'utf-8')) as WebsitesData;
  
  data.websites.push(entry);
  // Sortujemy po dacie dodania (najnowsze na górze)
  data.websites.sort((a, b) => {
    const dateA = new Date(a.added || '1970-01-01'); // fallback dla starych wpisów
    const dateB = new Date(b.added || '1970-01-01');
    return dateB.getTime() - dateA.getTime();
  });
  
  writeFileSync(jsonPath, JSON.stringify(data, null, 2));
}

// Funkcja do parsowania body issue
function parseIssueBody(body: string) {
  // Normalizujemy końce linii i usuwamy zbędne spacje
  const normalizedBody = body.replace(/\\n/g, '\n').trim();
  const sections = normalizedBody.split('###').filter(Boolean);
  
  let name = '';
  let url = '';
  let location = '';

  for (const section of sections) {
    const [title, ...contentLines] = section.trim().split('\n');
    const content = contentLines.join('\n').trim();

    if (title.includes('Your Name')) {
      name = content;
    }
    if (title.includes('Website URL')) {
      url = content;
    }
    if (title.includes('Location')) {
      location = content;
    }
  }

  console.log('Parsed data:', { name, url, location });
  return { name, url, location };
}

// Funkcja do pobierania danych z GitHub API
async function getIssueData(issueNumber: string): Promise<IssueData> {
  const response = await fetch(
    `https://api.github.com/repos/screenfluent/personalwebsites/issues/${issueNumber}`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Jeśli potrzebujesz tokena:
        // 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch issue: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    title: data.title,
    body: data.body
  };
}

// Main code
async function main() {
  const issueNumber = process.argv[2];
  
  if (!issueNumber) {
    console.error('Usage: bun run add-website <issue_number> [--save] [--comment]');
    process.exit(1);
  }

  try {
    console.log('Fetching issue data...');
    const issueData = await getIssueData(issueNumber);
    const { name, url, location } = parseIssueBody(issueData.body);

    if (!name || !url || !location) {
      console.error('Could not find all required data in the issue!');
      process.exit(1);
    }

    const entry = generateWebsiteEntry(name, url, location);
    console.log('Generated entry:');
    console.log(JSON.stringify(entry, null, 2));

    if (process.argv.includes('--save')) {
      addWebsiteToJson(entry);
      console.log('Entry added to websites.json!');

      // If we have a token and want to add a comment
      if (process.env.GITHUB_TOKEN && process.argv.includes('--comment')) {
        await addIssueComment(issueNumber, entry);
        console.log('Added comment to the issue!');
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Function to add a comment to the issue
async function addIssueComment(issueNumber: string, entry: Website): Promise<void> {
  const response = await fetch(
    `https://api.github.com/repos/screenfluent/personalwebsites/issues/${issueNumber}/comments`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        body: `✨ Website has been added to the gallery!\n\n` +
              `- Name: ${entry.name}\n` +
              `- URL: ${entry.url}\n` +
              `- Country: ${entry.country.name} ${entry.country.flag}\n\n` +
              `Thanks for your submission! 🚀`
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to add comment: ${response.statusText}`);
  }
}

main(); 