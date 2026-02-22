const DEFAULT_LOCAL_API_BASE_URL = 'http://127.0.0.1:4000';
const DEFAULT_LOCAL_SITE_URL = 'http://localhost:3000';

type ApiRequestOptions = {
    revalidateSeconds?: number;
    timeoutMs?: number;
};

function normalizeBaseUrl(value: string) {
    return value.replace(/\/+$/, '');
}

function withProtocol(value: string) {
    if (value.startsWith('http://') || value.startsWith('https://')) {
        return value;
    }
    return `https://${value}`;
}

export function getApiBaseUrl() {
    const value =
        process.env.API_BASE_URL ||
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        DEFAULT_LOCAL_API_BASE_URL;

    return normalizeBaseUrl(value);
}

export function getSiteUrl() {
    const value =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.URL ||
        process.env.DEPLOY_PRIME_URL ||
        DEFAULT_LOCAL_SITE_URL;

    return normalizeBaseUrl(withProtocol(value));
}

export function buildApiUrl(pathname: string) {
    const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
    return `${getApiBaseUrl()}${normalizedPath}`;
}

export async function fetchApi<T>(pathname: string, options: ApiRequestOptions = {}): Promise<T> {
    const timeoutMs = options.timeoutMs ?? 7000;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const requestOptions: RequestInit & { next?: { revalidate: number } } = {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal
    };

    if (typeof options.revalidateSeconds === 'number') {
        requestOptions.next = { revalidate: options.revalidateSeconds };
    }

    try {
        const response = await fetch(buildApiUrl(pathname), requestOptions);
        if (!response.ok) {
            throw new Error(`API request failed (${response.status})`);
        }
        return (await response.json()) as T;
    } finally {
        clearTimeout(timeout);
    }
}
