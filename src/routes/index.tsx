import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '@/(home)/Hero'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  console.log('Index component rendering')
  return <div className='flex flex-col min-h-screen px-4'>test</div>
}
