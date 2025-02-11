export interface Country {
  code: string;
  flag: string;
  name: string;
}

export interface Website {
  name: string;
  screenshot: string;
  url: string;
  country: Country;
}

export interface WebsitesData {
  websites: Website[];
}

export interface WipTodo {
  id: string;
  created_at: string;
  updated_at: string;
  body: string;
  url: string;
  attachments: any[];
  user_id: string;
  projects: any[];
}

export interface WipResponse {
  data: WipTodo[];
  has_more: boolean;
  total_count: number;
}