import { createFileRoute, notFound } from '@tanstack/react-router'
import { useEffect } from 'react'
import { RESUME } from '@/data/resume'
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/resume/$company')({
  loader: ({ params }) => {
    const job = RESUME.find((j) => j.id === params.company)
    if (!job) {
      throw notFound()
    }
    return { job }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { job } = Route.useLoaderData()
  const { setBreadcrumbLabel } = useBreadcrumbs()

  // Set breadcrumb label when component mounts or job changes
  useEffect(() => {
    setBreadcrumbLabel(job.companyName)
  }, [job.companyName, setBreadcrumbLabel])

  return (
    <div className='p-6'>
      <div className='flex items-center gap-4 mb-6'>
        <Button variant='outline' className='rounded-full w-20 h-20'>
          <a href={job.icon.href} target='_blank' rel='noopener noreferrer'>
            {job.icon && <job.icon.icon className='size-12 fill-foreground' />}
          </a>
        </Button>
        <div>
          <h1 className='text-3xl font-bold'>{job.companyName}</h1>
          <p className='text-xl text-muted-foreground'>{job.role}</p>
          <p className='text-sm text-muted-foreground'>
            {job.startDate} - {job.endDate}
          </p>
        </div>
      </div>

      <div className='space-y-6'>
        <div>
          <h2 className='text-xl font-semibold mb-3'>Key Accomplishments</h2>
          <ul className='list-disc list-inside space-y-2'>
            {job.accomplishments.map((accomplishment, index) => (
              <li key={index} className='text-muted-foreground'>
                {accomplishment}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className='text-xl font-semibold mb-3'>Technologies Used</h2>
          <div className='flex flex-wrap gap-2'>
            {job.techUsed.map((tech, index) => (
              <span key={index} className='px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm'>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
