export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
}

export const DEFAULT_SEO: Required<Omit<SEOProps, 'publishedTime' | 'modifiedTime' | 'section' | 'tags'>> = {
  title: 'Jonathan Pe - Senior Frontend Software Engineer',
  description:
    'Senior Frontend Software Engineer with deep experience building modern, performant web applications using React and TypeScript. Currently at Meta, previously at Apple.',
  keywords: [
    'Jonathan Pe',
    'Frontend Engineer',
    'React Developer',
    'TypeScript',
    'Software Engineer',
    'Meta',
    'Apple',
    'San Francisco',
    'Web Development',
    'JavaScript',
    'UI/UX',
    'Full Stack Developer',
  ],
  image: 'https://www.jonathanpe.com/og-image.jpg',
  url: 'https://www.jonathanpe.com',
  type: 'profile',
  author: 'Jonathan Pe',
}

export function generateSEOTitle(pageTitle?: string): string {
  if (!pageTitle) return DEFAULT_SEO.title
  return `${pageTitle} | Jonathan Pe`
}

export function generateSEODescription(pageDescription?: string): string {
  return pageDescription || DEFAULT_SEO.description
}

export function generateSEOKeywords(pageKeywords?: string[]): string {
  const allKeywords = [...DEFAULT_SEO.keywords, ...(pageKeywords || [])]
  return Array.from(new Set(allKeywords)).join(', ')
}

export function generateSEOUrl(path: string): string {
  const baseUrl = DEFAULT_SEO.url
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

// Structured data generators
export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jonathan Pe',
    jobTitle: 'Senior Frontend Software Engineer',
    url: 'https://www.jonathanpe.com',
    email: 'jonathanqpe@gmail.com',
    sameAs: ['https://github.com/jonathan-pe', 'https://linkedin.com/in/jonathanqpe'],
    worksFor: {
      '@type': 'Organization',
      name: 'Meta',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'California Polytechnic State University: San Luis Obispo',
    },
    knowsAbout: [
      'React.js',
      'TypeScript',
      'JavaScript',
      'Frontend Development',
      'Web Development',
      'User Interface Design',
      'Software Engineering',
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Software Engineer',
      occupationalCategory: 'Software Development',
      skills: 'React.js, TypeScript, JavaScript, Node.js, GraphQL',
    },
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Jonathan Pe - Portfolio',
    alternateName: 'Jonathan Pe',
    url: 'https://www.jonathanpe.com',
    description: 'Senior Frontend Software Engineer portfolio showcasing projects and professional experience',
    author: {
      '@type': 'Person',
      name: 'Jonathan Pe',
    },
    publisher: {
      '@type': 'Person',
      name: 'Jonathan Pe',
    },
  }
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  }
}
