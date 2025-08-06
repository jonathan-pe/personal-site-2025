import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/web-development')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/projects/web-development"!</div>
}
