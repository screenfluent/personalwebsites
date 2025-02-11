export interface Country {
  code: string;
  flag: string;
  name: string;
}

export interface Website {
  name: string;
  screenshot: string;  // changed from avatar to screenshot
  url: string;
  country: Country;
}

export interface WebsitesData {
  websites: Website[];
}