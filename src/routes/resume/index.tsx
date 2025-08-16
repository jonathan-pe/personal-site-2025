import { createFileRoute } from '@tanstack/react-router'
import { SEOHead } from '@/components/SEOHead'
import ResumePage from '@/components/resume/ResumePage'
import { RESUME } from '@/data/resume'

export const Route = createFileRoute('/resume/')({
  component: RouteComponent,
})

function RouteComponent() {
  const companies = RESUME.map((job) => job.companyName).join(', ')
  const technologies = Array.from(new Set(RESUME.flatMap((job) => job.techUsed)))
    .slice(0, 15)
    .join(', ')

  return (
    <>
      <SEOHead
        title='Professional Resume & Experience'
        description={`Senior Frontend Software Engineer with ${Math.floor(
          (new Date().getTime() - new Date('2017-07-01').getTime()) / (1000 * 60 * 60 * 24 * 365.25)
        )}+ years of experience at top tech companies including ${companies}. Expert in ${technologies}.`}
        keywords={[
          'resume',
          'professional experience',
          'software engineer career',
          'frontend engineer',
          'tech companies',
          'work history',
          ...RESUME.slice(0, 3).map((job) => job.companyName.toLowerCase()),
          ...Array.from(new Set(RESUME.flatMap((job) => job.techUsed))).slice(0, 10),
        ]}
        url='/resume'
        type='website'
      />
      <ResumePage />
    </>
  )
}
