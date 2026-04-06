import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 블로그 원본글 경로
const postsDirectory = path.join(process.cwd(), 'src', 'content', 'posts');
// 저장할 경로
const siteMapPath = path.join(process.cwd(), 'public', 'sitemap.xml');

function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return { slug, date: data.date };
    });
}

function generateSitemap() {
  const baseUrl = 'https://ulsan365.com';
  const posts = getAllPosts();

  const blogUrls = posts.map((post) => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}/</loc>
    <lastmod>${new Date(post.date).toISOString().split('T')[0]}</lastmod>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/about/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/blog/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/qna/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
${blogUrls}
</urlset>`;

  try {
    fs.writeFileSync(siteMapPath, xml.trim(), 'utf-8');
    console.log('✅ sitemap.xml created in public folder!');
  } catch (e) {
    console.error('❌ Failed to create sitemap.xml:', e);
  }
}

generateSitemap();
