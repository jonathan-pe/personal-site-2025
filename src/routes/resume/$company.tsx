import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/resume/$company')({
  component: RouteComponent,
})

function RouteComponent() {
  const { company } = Route.useParams()

  return <div>Hello /resume/{company}!</div>
}
