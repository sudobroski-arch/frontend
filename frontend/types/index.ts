export interface Article {
    id: number;
    title: string;
    summary: string;
    source_urls: string[];
    source_names: string[];
    category: string;
    region: string;
    published_at: string;
    created_at: string;
}

export type Category = 'politics' | 'tech' | 'science' | 'general';
export type Region = 'us' | 'eu' | 'global';
