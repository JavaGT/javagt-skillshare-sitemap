import fetch from "node-fetch";
import xml2js from "xml2js";

const TIMEOUT_MS = 10000;
const USER_AGENT = 'Mozilla/5.0 (compatible; javagt-skillshare-sitemap/1.1; +https://github.com/JavaGT/javagt-skillshare-sitemap)';

async function get(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let res;
    try {
        res = await fetch(url, {
            signal: controller.signal,
            headers: { 'User-Agent': USER_AGENT }
        });
    } finally {
        clearTimeout(timeout);
    }

    const text = await res.text();
    return parseSitemapXml(text);
}

/**
 * Parse a sitemap XML string into an array of URLs.
 * @param {string} xml - The sitemap XML content
 * @returns {Promise<string[]>} Array of location URLs from the sitemap
 * @throws {Error} If the XML is invalid or the parsed result is missing expected structure
 */
export async function parseSitemapXml(xml) {
    let data;
    try {
        data = await xml2js.parseStringPromise(xml);
    } catch (err) {
        throw new Error(`Failed to parse sitemap XML: ${err.message}`);
    }

    if (!data || !data.urlset || !Array.isArray(data.urlset.url)) {
        throw new Error('Sitemap XML has unexpected structure: missing urlset/url');
    }

    return data.urlset.url.map((entry, i) => {
        if (!entry.loc || !entry.loc[0]) {
            throw new Error(`Sitemap entry at index ${i} missing loc field`);
        }
        return entry.loc[0];
    });
}

/**
 * Fetch and parse the Skillshare browse sitemap.
 * @returns {Promise<string[]>} Array of browse page URLs
 */
export function getBrowse() {
    return get('https://www.skillshare.com/sitemap/browse/1');
}

/**
 * Fetch and parse the Skillshare classes sitemap.
 * @returns {Promise<string[]>} Array of class page URLs
 */
export function getClasses() {
    return get('https://www.skillshare.com/sitemap/classes/1');
}

/**
 * Fetch and parse the Skillshare teachers sitemap.
 * @returns {Promise<string[]>} Array of teacher page URLs
 */
export function getTeachers() {
    return get('https://www.skillshare.com/sitemap/teachers/1');
}

/**
 * Fetch and parse the Skillshare workshops sitemap.
 * @returns {Promise<string[]>} Array of workshop page URLs
 */
export function getWorkshops() {
    return get('https://www.skillshare.com/sitemap/workshops/1');
}

/**
 * Fetch and parse the Skillshare lists sitemap.
 * @returns {Promise<string[]>} Array of list page URLs
 */
export function getLists() {
    return get('https://www.skillshare.com/sitemap/lists/1');
}
