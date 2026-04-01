import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://fox-dev-hub.vercel.app/sitemap.xml', // Replace with actual domain
  }
}
