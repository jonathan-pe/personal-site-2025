import { useEffect } from 'react'
import type { SEOProps } from '@/lib/seo'
import {
  generateSEOTitle,
  generateSEODescription,
  generateSEOKeywords,
  generateSEOUrl,
} from '@/lib/seo'

interface SEOHeadProps extends SEOProps {
  structuredData?: Record<string, unknown>[]
}

export function SEOHead({
  title,
  description,
  keywords,
  url,
}: SEOHeadProps) {
  useEffect(() => {
    // Skip if not in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    try {
      // Update document title
      const seoTitle = generateSEOTitle(title)
      document.title = seoTitle

      // Update meta description
      const seoDescription = generateSEODescription(description)
      let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.name = 'description'
        document.head.appendChild(metaDescription)
      }
      metaDescription.content = seoDescription

      // Update meta keywords
      if (keywords) {
        const seoKeywords = generateSEOKeywords(keywords)
        let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta')
          metaKeywords.name = 'keywords'
          document.head.appendChild(metaKeywords)
        }
        metaKeywords.content = seoKeywords
      }

      // Update canonical URL
      if (url) {
        const seoUrl = generateSEOUrl(url)
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
        if (!canonical) {
          canonical = document.createElement('link')
          canonical.rel = 'canonical'
          document.head.appendChild(canonical)
        }
        canonical.href = seoUrl
      }
    } catch (error) {
      console.error('SEO Head error:', error)
    }
  }, [title, description, keywords, url])

  return null
}
