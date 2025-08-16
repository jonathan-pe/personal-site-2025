import HomePage from '@/components/home/HomePage'
import { SEOHead } from '@/components/SEOHead'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <>
      <SEOHead
        title='Jonathan Pe - Senior Frontend Software Engineer'
        description='Senior Frontend Software Engineer with deep experience building modern, performant web applications using React and TypeScript. Currently at Meta, previously at Apple.'
        keywords={[
          'frontend engineer',
          'react developer',
          'typescript',
          'software engineer',
          'meta',
          'apple',
          'web development',
          'javascript',
          'ui/ux',
          'portfolio',
        ]}
        url='/'
        type='website'
      />
      <div className='flex flex-col min-h-screen px-4'>
        <HomePage />
      </div>
    </>
  )
}
