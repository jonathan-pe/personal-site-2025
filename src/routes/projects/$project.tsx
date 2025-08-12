import { createFileRoute, notFound } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  Github,
  Star,
  Users,
  Code2,
  Lightbulb,
  Target,
  TrendingUp,
  Tag,
  User,
  Globe,
  Archive,
  Zap,
  Play,
  ChevronDown,
} from 'lucide-react'

import { PROJECTS } from '@/data/projects'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import TechBadge from '@/components/TechBadge'
import { cn } from '@/lib/utils'
import { GithubLogoIcon } from '@phosphor-icons/react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

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

const statusConfig = {
  live: { label: 'Live', icon: Globe, color: 'text-green-600 bg-green-100 dark:bg-green-900/20' },
  'in-development': { label: 'In Development', icon: Code2, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20' },
  archived: { label: 'Archived', icon: Archive, color: 'text-gray-600 bg-gray-100 dark:bg-gray-900/20' },
  concept: { label: 'Concept', icon: Lightbulb, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20' },
}

const complexityConfig = {
  beginner: { label: 'Beginner', color: 'text-green-600 bg-green-100 dark:bg-green-900/20' },
  intermediate: { label: 'Intermediate', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20' },
  advanced: { label: 'Advanced', color: 'text-red-600 bg-red-100 dark:bg-red-900/20' },
}

function RouteComponent() {
  const { project } = Route.useLoaderData()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
      },
    },
  }

  const StatusIcon = statusConfig[project.status].icon

  return (
    <div className='min-h-screen bg-background p-6 space-y-6'>
      <motion.div variants={containerVariants} initial='hidden' animate='visible' className='max-w-6xl mx-auto'>
        {/* Project Header */}
        <motion.div className='bg-card rounded-xl p-6 shadow-lg border mb-6' variants={cardVariants}>
          <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6'>
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-2'>
                <h1 className='text-3xl font-bold'>{project.title}</h1>
                {project.featured && (
                  <div className='flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 rounded-md text-xs font-medium'>
                    <Star className='w-3 h-3' />
                    Featured
                  </div>
                )}
              </div>
              <p className='text-lg text-muted-foreground mb-4'>{project.description}</p>
              <div className='flex flex-wrap items-center gap-3'>
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
                    statusConfig[project.status].color
                  )}
                >
                  <StatusIcon className='w-4 h-4' />
                  {statusConfig[project.status].label}
                </div>
                <div
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium',
                    complexityConfig[project.complexity].color
                  )}
                >
                  {complexityConfig[project.complexity].label}
                </div>
                <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                  <Users className='w-4 h-4' />
                  Team of {project.teamSize}
                </div>
              </div>
            </div>
            <div className='flex gap-3'>
              {project.demoUrl && project.id !== 'personalWebsite' && (
                <Button asChild>
                  <a href={project.demoUrl} target='_blank' rel='noopener noreferrer'>
                    <Play className='w-4 h-4 mr-2' />
                    Live Demo
                  </a>
                </Button>
              )}
              {project.demoUrl && project.id === 'personalWebsite' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button disabled>
                        <Play className='w-4 h-4 mr-2' />
                        Live Demo
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>You're already on it :)</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {project.url && !project.demoUrl && (
                <Button asChild>
                  <a href={project.url} target='_blank' rel='noopener noreferrer'>
                    <ExternalLink className='w-4 h-4 mr-2' />
                    Visit Project
                  </a>
                </Button>
              )}
              {project.githubUrls && project.githubUrls.length === 1 && (
                <Button asChild variant='outline'>
                  <a href={project.githubUrls[0].repoUrl} target='_blank' rel='noopener noreferrer'>
                    <GithubLogoIcon className='w-4 h-4 mr-2' />
                    View Code
                  </a>
                </Button>
              )}
              {project.githubUrls && project.githubUrls.length > 1 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline'>
                      <GithubLogoIcon className='w-4 h-4 mr-2' />
                      View Code
                      <ChevronDown className='w-4 h-4 ml-2' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    {project.githubUrls.map((repo, index) => (
                      <DropdownMenuItem key={index} asChild>
                        <a href={repo.repoUrl} target='_blank' rel='noopener noreferrer' className='w-full'>
                          <Github className='w-4 h-4 mr-2' />
                          {repo.repoName}
                        </a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Project Info Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='bg-background rounded-lg p-4 border'>
              <div className='flex items-center gap-2 mb-2'>
                <User className='w-4 h-4 text-primary' />
                <h3 className='font-medium'>My Role</h3>
              </div>
              <p className='text-sm text-muted-foreground'>{project.myRole}</p>
            </div>
            <div className='bg-background rounded-lg p-4 border'>
              <div className='flex items-center gap-2 mb-2'>
                <Tag className='w-4 h-4 text-primary' />
                <h3 className='font-medium'>Category</h3>
              </div>
              <p className='text-sm text-muted-foreground capitalize'>{project.category.replace('-', ' ')}</p>
            </div>
            <div className='bg-background rounded-lg p-4 border'>
              <div className='flex items-center gap-2 mb-2'>
                <Zap className='w-4 h-4 text-primary' />
                <h3 className='font-medium'>Type</h3>
              </div>
              <p className='text-sm text-muted-foreground capitalize'>{project.type}</p>
            </div>
          </div>
        </motion.div>

        {/* Technologies Used */}
        <motion.div className='bg-card rounded-xl p-6 shadow-lg border mb-6' variants={cardVariants}>
          <div className='flex items-center gap-2 mb-4'>
            <Code2 className='w-5 h-5 text-primary' />
            <h2 className='text-xl font-semibold'>Technologies Used</h2>
          </div>
          <div className='flex flex-wrap gap-2'>
            {project.techUsed.map((tech) => (
              <TechBadge key={tech} tech={tech} />
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Key Features */}
          <motion.div className='bg-card rounded-xl p-6 shadow-lg border' variants={cardVariants}>
            <div className='flex items-center gap-2 mb-4'>
              <Target className='w-5 h-5 text-primary' />
              <h2 className='text-xl font-semibold'>Key Features</h2>
            </div>
            <ul className='space-y-3'>
              {project.keyFeatures.map((feature, index) => (
                <li key={index} className='flex items-start gap-3'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0' />
                  <span className='text-sm'>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Challenges */}
          <motion.div className='bg-card rounded-xl p-6 shadow-lg border' variants={cardVariants}>
            <div className='flex items-center gap-2 mb-4'>
              <Zap className='w-5 h-5 text-primary' />
              <h2 className='text-xl font-semibold'>Challenges</h2>
            </div>
            <ul className='space-y-3'>
              {project.challenges.map((challenge, index) => (
                <li key={index} className='flex items-start gap-3'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0' />
                  <span className='text-sm'>{challenge}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Learnings */}
          <motion.div className='bg-card rounded-xl p-6 shadow-lg border' variants={cardVariants}>
            <div className='flex items-center gap-2 mb-4'>
              <TrendingUp className='w-5 h-5 text-primary' />
              <h2 className='text-xl font-semibold'>Key Learnings</h2>
            </div>
            <ul className='space-y-3'>
              {project.learnings.map((learning, index) => (
                <li key={index} className='flex items-start gap-3'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0' />
                  <span className='text-sm'>{learning}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Tags & Additional Info */}
          <motion.div className='bg-card rounded-xl p-6 shadow-lg border' variants={cardVariants}>
            <div className='flex items-center gap-2 mb-4'>
              <Tag className='w-5 h-5 text-primary' />
              <h2 className='text-xl font-semibold'>Project Tags</h2>
            </div>
            <div className='flex flex-wrap gap-2 mb-6'>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className='px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full font-medium'
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
