import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://myfamilyapp.vercel.app'
  
  const features = ['ai-photo-restoration', 'relation-finder']
  
  const featureUrls = features.map((slug) => ({
    url: `${baseUrl}/features/${slug}`,
    lastModified: new Date(),
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    ...featureUrls,
  ]
}