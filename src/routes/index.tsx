import HomePage from '@/components/home/HomePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className='flex flex-col min-h-screen px-4'>
      <HomePage />
    </div>
  )
}
