export interface Country {
  code: string;
  flag: string;
  name: string;
}

export interface Website {
  name: string;
  avatar: string;
  url: string;
  country: Country;
}

export interface WebsitesData {
  websites: Website[];
}