import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$project')({
  component: RouteComponent,
})

function RouteComponent() {
  const { project } = Route.useParams()
  return <div>Hello "/projects/{project}"!</div>
}
