import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseSitemapXml } from './index.mjs';

function makeSitemapXml(urls) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset>
${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;
}

describe('parseSitemapXml', () => {
    it('should parse a valid sitemap with multiple URLs', async () => {
        const xml = makeSitemapXml([
            'https://www.skillshare.com/classes/abc',
            'https://www.skillshare.com/classes/def',
        ]);
        const result = await parseSitemapXml(xml);
        assert.deepEqual(result, [
            'https://www.skillshare.com/classes/abc',
            'https://www.skillshare.com/classes/def',
        ]);
    });

    it('should parse a sitemap with a single URL', async () => {
        const xml = makeSitemapXml(['https://www.skillshare.com/browse/1']);
        const result = await parseSitemapXml(xml);
        assert.deepEqual(result, ['https://www.skillshare.com/browse/1']);
    });

    it('should throw on invalid XML', async () => {
        await assert.rejects(
            () => parseSitemapXml('not xml'),
            /Failed to parse sitemap XML/
        );
    });

    it('should throw on missing urlset', async () => {
        await assert.rejects(
            () => parseSitemapXml('<root></root>'),
            /unexpected structure/
        );
    });
});
