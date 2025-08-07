import { createFileRoute, notFound } from '@tanstack/react-router'
import { useEffect } from 'react'
import { PROJECTS } from '@/data/projects'
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs'

export const Route = createFileRoute('/projects/$project')({
  loader: ({ params }) => {
    const project = PROJECTS.find((p) => p.id === params.project)
    if (!project) {
      throw notFound()
    }
    return { project }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { project } = Route.useLoaderData()
  const { setBreadcrumbLabel } = useBreadcrumbs()

  // Set breadcrumb label when component mounts or project changes
  useEffect(() => {
    setBreadcrumbLabel(project.title)
  }, [project.title, setBreadcrumbLabel])

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-4'>{project.title}</h1>
      <p className='text-lg text-muted-foreground mb-4'>{project.description}</p>
      <div className='space-y-2'>
        <h2 className='text-xl font-semibold'>Technologies Used:</h2>
        <ul className='list-disc list-inside'>
          {project.techUsed.map((tech, index) => (
            <li key={index}>{tech}</li>
          ))}
        </ul>
      </div>
      {project.url && (
        <div className='mt-6'>
          <a
            href={project.url}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'
          >
            Visit Project
          </a>
        </div>
      )}
    </div>
  )
}
