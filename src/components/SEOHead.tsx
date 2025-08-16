import { useEffect } from 'react'
import type { SEOProps } from '@/lib/seo'
import {
  DEFAULT_SEO,
  generateSEOTitle,
  generateSEODescription,
  generateSEOKeywords,
  generateSEOUrl,
  generatePersonSchema,
  generateWebsiteSchema,
} from '@/lib/seo'

interface SEOHeadProps extends SEOProps {
  structuredData?: Record<string, unknown>[]
}

export function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags,
  structuredData = [],
}: SEOHeadProps) {
  const seoTitle = generateSEOTitle(title)
  const seoDescription = generateSEODescription(description)
  const seoKeywords = generateSEOKeywords(keywords)
  const seoImage = image || DEFAULT_SEO.image
  const seoUrl = url ? generateSEOUrl(url) : DEFAULT_SEO.url
  const seoAuthor = author || DEFAULT_SEO.author

  useEffect(() => {
    // Update document title
    document.title = seoTitle

    // Helper function to set or update meta tag
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let meta = document.querySelector(selector) as HTMLMetaElement

      if (!meta) {
        meta = document.createElement('meta')
        if (isProperty) {
          meta.setAttribute('property', name)
        } else {
          meta.setAttribute('name', name)
        }
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    // Helper function to set or update link tag
    const setLinkTag = (rel: string, href: string, type?: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement

      if (!link) {
        link = document.createElement('link')
        link.rel = rel
        document.head.appendChild(link)
      }
      link.href = href
      if (type) link.type = type
    }

    // Basic meta tags
    setMetaTag('description', seoDescription)
    setMetaTag('keywords', seoKeywords)
    setMetaTag('author', seoAuthor)
    setMetaTag('robots', 'index, follow')
    setMetaTag('googlebot', 'index, follow')

    // Open Graph meta tags
    setMetaTag('og:title', seoTitle, true)
    setMetaTag('og:description', seoDescription, true)
    setMetaTag('og:image', seoImage, true)
    setMetaTag('og:url', seoUrl, true)
    setMetaTag('og:type', type, true)
    setMetaTag('og:site_name', 'Jonathan Pe', true)
    setMetaTag('og:locale', 'en_US', true)

    // Twitter Card meta tags
    setMetaTag('twitter:card', 'summary_large_image')
    setMetaTag('twitter:title', seoTitle)
    setMetaTag('twitter:description', seoDescription)
    setMetaTag('twitter:image', seoImage)
    setMetaTag('twitter:creator', '@jonathan_pe')
    setMetaTag('twitter:site', '@jonathan_pe')

    // Additional meta tags for articles/blog posts
    if (type === 'article') {
      setMetaTag('article:author', seoAuthor, true)
      if (publishedTime) setMetaTag('article:published_time', publishedTime, true)
      if (modifiedTime) setMetaTag('article:modified_time', modifiedTime, true)
      if (section) setMetaTag('article:section', section, true)
      if (tags) {
        tags.forEach((tag) => {
          const meta = document.createElement('meta')
          meta.setAttribute('property', 'article:tag')
          meta.content = tag
          document.head.appendChild(meta)
        })
      }
    }

    // Canonical URL
    setLinkTag('canonical', seoUrl)

    // Structured data
    const allStructuredData = [generatePersonSchema(), generateWebsiteSchema(), ...structuredData]

    // Remove existing structured data scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]')
    existingScripts.forEach((script) => script.remove())

    // Add new structured data
    allStructuredData.forEach((data, index) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(data)
      script.id = `structured-data-${index}`
      document.head.appendChild(script)
    })

    // Cleanup function to remove meta tags when component unmounts
    return () => {
      // Note: We don't clean up meta tags on unmount to avoid flashing
      // The next page will update them as needed
    }
  }, [
    seoTitle,
    seoDescription,
    seoKeywords,
    seoImage,
    seoUrl,
    seoAuthor,
    type,
    publishedTime,
    modifiedTime,
    section,
    tags,
    structuredData,
  ])

  return null // This component doesn't render anything visible
}
