import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fox-dev-tools.vercel.app'
  
  const rules = [
    { url: baseUrl, priority: 1 },
    { url: `${baseUrl}/en/json-tools/json-formatter`, priority: 0.8 },
    { url: `${baseUrl}/en/json-tools/json-validator`, priority: 0.8 },
    { url: `${baseUrl}/en/json-tools/json-diff`, priority: 0.8 },
    { url: `${baseUrl}/en/json-tools/json-visualizer`, priority: 0.8 },
    { url: `${baseUrl}/en/json-tools/json-type-generator`, priority: 0.8 },
    { url: `${baseUrl}/en/json-tools/json-to-table`, priority: 0.8 },
    { url: `${baseUrl}/en/json-tools/json-path-tester`, priority: 0.8 },
    { url: `${baseUrl}/en/json-tools/json-relationship-visualizer`, priority: 0.8 },
    { url: `${baseUrl}/en/base64-tools/base64-encoder-decoder`, priority: 0.8 },
    { url: `${baseUrl}/en/base64-tools/image-to-base64`, priority: 0.8 },
    { url: `${baseUrl}/en/base64-tools/base64-to-image`, priority: 0.8 },
  ]
  
  return rules.map(rule => ({
    url: rule.url,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: rule.priority,
  }))
}
