import tags from '$data/tags';
import topics from '$data/topics';
import { BASE_URL } from '$data/urls';
import { getPosts } from '$lib/posts';
import type { RequestHandler } from './$types';

// Generate a basic XML sitemap.
// See https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap#xml.

function createPage(href: string, lastmod?: string | Date) {
	return `
    <url>
      <loc>${new URL(href, BASE_URL).href}</loc>
      ${lastmod ? '<lastmod>' + lastmod + '</lastmod>' : ''}
    </url>
  `;
}

export const GET: RequestHandler = async function () {
	// Post pages.
	const posts = await getPosts({ compare: 'modified' });
	const postPages = posts.map((post) => createPage(post.path, post.modified));

	// Topic pages.
	const topicPages = topics.map((topic) => createPage(topic.path));

	// Tag pages.
	const tagPages = tags.map((tag) => createPage(tag.path));

	const pages = [createPage('/'), createPage('posts'), ...postPages, ...topicPages, ...tagPages];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages.join('\n')}
	</urlset>
  `;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
