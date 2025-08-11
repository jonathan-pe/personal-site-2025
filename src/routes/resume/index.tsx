import { createFileRoute } from '@tanstack/react-router'
import ResumePage from '@/components/resume/ResumePage'

export const Route = createFileRoute('/resume/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ResumePage />
}
