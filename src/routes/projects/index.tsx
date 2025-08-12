import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import {
  Code2,
  Globe,
  ExternalLink,
  TrendingUp,
  Users,
  Github,
  Target,
  Lightbulb,
  Star,
  Badge,
  Award,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import TechBadge from '@/components/TechBadge'
import { PROJECTS } from '@/data/projects'
import { TECH_METADATA } from '@/data/techCategories'
import { cn } from '@/lib/utils'
import { GithubLogoIcon } from '@phosphor-icons/react'

export const Route = createFileRoute('/projects/')({
  component: ProjectsOverviewPage,
})

function ProjectsOverviewPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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

  // Extract all unique technologies from projects
  const allTechnologies = Array.from(new Set(PROJECTS.flatMap((project) => project.techUsed)))

  // Group technologies by category
  const techByCategory = allTechnologies.reduce((acc, tech) => {
    const metadata = TECH_METADATA[tech]
    if (metadata) {
      const categoryName = metadata.category.name
      if (!acc[categoryName]) {
        acc[categoryName] = {
          category: metadata.category,
          technologies: [],
        }
      }
      acc[categoryName].technologies.push(tech)
    } else {
      // Handle unknown technologies
      if (!acc['Other']) {
        acc['Other'] = {
          category: { name: 'Other', icon: Code2, color: 'gray', priority: 1 },
          technologies: [],
        }
      }
      acc['Other'].technologies.push(tech)
    }
    return acc
  }, {} as Record<string, { category: { name: string; icon: typeof Code2; color: string; priority: number }; technologies: string[] }>)

  // Sort categories by priority and get top categories
  const topCategories = Object.values(techByCategory)
    .sort((a, b) => (b.category.priority || 0) - (a.category.priority || 0))
    .slice(0, 4)

  // Enhanced project metrics showing growth
  const liveProjects = PROJECTS.filter((p) => p.status === 'live')
  const featuredProjects = PROJECTS.filter((p) => p.featured)
  const complexityLevels = {
    beginner: PROJECTS.filter((p) => p.complexity === 'beginner').length,
    intermediate: PROJECTS.filter((p) => p.complexity === 'intermediate').length,
    advanced: PROJECTS.filter((p) => p.complexity === 'advanced').length,
  }

  const metrics = [
    {
      label: 'Featured Projects',
      value: featuredProjects.length.toString(),
      icon: Star,
      color: 'yellow',
      subtitle: 'Showcasing best work',
    },
    {
      label: 'Live Applications',
      value: liveProjects.length.toString(),
      icon: Globe,
      color: 'green',
      subtitle: 'Deployed and accessible',
    },
    {
      label: 'Technologies Mastered',
      value: allTechnologies.length.toString(),
      icon: Code2,
      color: 'blue',
      subtitle: 'Across ' + Object.keys(techByCategory).length + ' categories',
    },
    {
      label: 'Advanced Projects',
      value: complexityLevels.advanced.toString(),
      icon: Award,
      color: 'purple',
      subtitle: 'Complex architecture',
    },
  ]

  return (
    <div className='min-h-screen bg-background p-6 space-y-6'>
      <motion.div variants={containerVariants} initial='hidden' animate='visible' className='max-w-7xl mx-auto'>
        {/* Header */}
        <motion.div className='bg-card rounded-xl p-6 shadow-lg border mb-6' variants={cardVariants}>
          <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6'>
            <div>
              <h1 className='text-3xl font-bold mb-2'>Projects Analytics Dashboard</h1>
              <p className='text-lg text-muted-foreground max-w-2xl'>
                A showcase of my technical journey - from concept to deployment. Each project represents my passion for
                learning new technologies and building products that just make sense.
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant='outline' size='sm'>
                  <a href='https://github.com/jonathan-pe' target='_blank' rel='noopener noreferrer'>
                    <Github className='w-4 h-4 mr-2' />
                    View on GitHub
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Some repositories might not appear as they are private</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </motion.div>

        {/* Enhanced Metrics Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
          {metrics.map((metric) => (
            <motion.div
              key={metric.label}
              className='bg-card rounded-xl p-6 shadow-lg border'
              variants={cardVariants}
              whileHover={{ y: -2 }}
            >
              <div className='flex items-center justify-between mb-3'>
                <div>
                  <p className='text-sm text-muted-foreground'>{metric.label}</p>
                  <p className='text-2xl font-bold'>{metric.value}</p>
                  <p className='text-xs text-muted-foreground mt-1'>{metric.subtitle}</p>
                </div>
                <div className='p-3 rounded-lg bg-muted/50'>
                  <metric.icon className='w-6 h-6 text-primary' />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Engineering Growth Journey */}
        <motion.div className='bg-card rounded-xl p-6 shadow-lg border mb-6' variants={cardVariants}>
          <h2 className='text-xl font-semibold mb-4'>Engineering Growth Journey</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Learning Highlights */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Lightbulb className='w-5 h-5 text-primary' />
                <h3 className='font-medium'>Key Learnings</h3>
              </div>
              <div className='space-y-2'>
                {PROJECTS.map((project) => project.learnings[0])
                  .filter(Boolean)
                  .map((learning, idx) => (
                    <div key={idx} className='text-sm text-muted-foreground flex items-start gap-2'>
                      <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0' />
                      {learning}
                    </div>
                  ))}
              </div>
            </div>

            {/* Challenge Categories */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Target className='w-5 h-5 text-primary' />
                <h3 className='font-medium'>Challenges Tackled</h3>
              </div>
              <div className='space-y-2'>
                {PROJECTS.map((project) => project.challenges[0])
                  .filter(Boolean)
                  .map((challenge, idx) => (
                    <div key={idx} className='text-sm text-muted-foreground flex items-start gap-2'>
                      <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0' />
                      {challenge}
                    </div>
                  ))}
              </div>
            </div>

            {/* Complexity Progression */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <TrendingUp className='w-5 h-5 text-primary' />
                <h3 className='font-medium'>Skill Progression</h3>
              </div>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>Beginner</span>
                  <div className='flex items-center gap-2'>
                    <div className='w-12 h-2 bg-muted rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-green-500 transition-all duration-500'
                        style={{ width: `${(complexityLevels.beginner / PROJECTS.length) * 100}%` }}
                      />
                    </div>
                    <span className='text-xs font-medium'>{complexityLevels.beginner}</span>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>Intermediate</span>
                  <div className='flex items-center gap-2'>
                    <div className='w-12 h-2 bg-muted rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-yellow-500 transition-all duration-500'
                        style={{ width: `${(complexityLevels.intermediate / PROJECTS.length) * 100}%` }}
                      />
                    </div>
                    <span className='text-xs font-medium'>{complexityLevels.intermediate}</span>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>Advanced</span>
                  <div className='flex items-center gap-2'>
                    <div className='w-12 h-2 bg-muted rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-red-500 transition-all duration-500'
                        style={{ width: `${(complexityLevels.advanced / PROJECTS.length) * 100}%` }}
                      />
                    </div>
                    <span className='text-xs font-medium'>{complexityLevels.advanced}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Technology Stack Overview */}
        <motion.div className='bg-card rounded-xl p-6 shadow-lg border mb-6' variants={cardVariants}>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-xl font-semibold mb-2'>Technology Expertise</h2>
              <p className='text-muted-foreground'>Technologies I've worked with across different project types</p>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {topCategories.map((categoryGroup) => (
              <div key={categoryGroup.category.name} className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <categoryGroup.category.icon className='w-5 h-5 text-primary' />
                  <h3 className='font-medium'>{categoryGroup.category.name}</h3>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {categoryGroup.technologies.map((tech) => (
                    <TechBadge key={tech} tech={tech} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* All Projects */}
        <div className='space-y-6 mb-12'>
          <motion.div className='flex items-center justify-between' variants={cardVariants}>
            <div>
              <h2 className='text-xl font-semibold mb-2'>All Projects</h2>
              <p className='text-muted-foreground'>
                A comprehensive view of my technical journey and engineering evolution
              </p>
            </div>
          </motion.div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {PROJECTS.map((project) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                whileHover={{
                  scale: 1.01,
                  transition: { duration: 0.15, ease: 'easeOut' },
                }}
                transition={{
                  duration: 0.15,
                  ease: 'easeOut',
                }}
                className='bg-card rounded-xl p-8 shadow-lg border group hover:border-primary/40'
              >
                <div className='space-y-6'>
                  {/* Project Header with Status */}
                  <div className='flex items-start justify-between'>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-3'>
                        <h3 className='text-lg font-semibold'>{project.title}</h3>
                        <div
                          className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            project.status === 'live' &&
                              'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                            project.status === 'in-development' &&
                              'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                            project.status === 'archived' &&
                              'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
                            project.status === 'concept' &&
                              'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          )}
                        >
                          {project.status.replace('-', ' ')}
                        </div>
                      </div>
                      <p className='text-sm text-muted-foreground leading-relaxed'>{project.description}</p>

                      {/* Complexity and Role */}
                      <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                        <div className='flex items-center gap-1'>
                          <Badge className='w-3 h-3' />
                          <span
                            className={cn(
                              'capitalize font-medium',
                              project.complexity === 'beginner' && 'text-green-600 dark:text-green-400',
                              project.complexity === 'intermediate' && 'text-yellow-600 dark:text-yellow-400',
                              project.complexity === 'advanced' && 'text-red-600 dark:text-red-400'
                            )}
                          >
                            {project.complexity}
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Users className='w-3 h-3' />
                          <span>{project.myRole}</span>
                        </div>
                      </div>
                    </div>
                    {project.url &&
                      (project.id === 'personalWebsite' ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className='relative z-10 pointer-events-auto'>
                              <Button variant='ghost' size='sm' disabled className='pointer-events-auto'>
                                <ExternalLink className='w-4 h-4' />
                              </Button>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side='top' className='z-50'>
                            You're currently on it :)
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Button asChild variant='ghost' size='sm' className='relative z-10'>
                          <a href={project.url} target='_blank' rel='noopener noreferrer'>
                            <ExternalLink className='w-4 h-4' />
                          </a>
                        </Button>
                      ))}
                  </div>

                  {/* Key Features */}
                  <div className='space-y-2'>
                    <h4 className='text-sm font-medium text-muted-foreground'>Key Features</h4>
                    <div className='grid grid-cols-1 gap-1'>
                      {project.keyFeatures.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className='text-sm text-muted-foreground flex items-start gap-2'>
                          <div className='w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0' />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies Used */}
                  <div className='space-y-2'>
                    <h4 className='text-sm font-medium text-muted-foreground'>Technologies</h4>
                    <div className='flex flex-wrap gap-2'>
                      {project.techUsed.slice(0, 6).map((tech) => (
                        <TechBadge key={tech} tech={tech} />
                      ))}
                      {project.techUsed.length > 6 && (
                        <span className='text-xs text-muted-foreground bg-muted px-2 py-1 rounded'>
                          +{project.techUsed.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Project Actions */}
                  <div className='flex items-center justify-between pt-2'>
                    <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                      <div className='flex items-center gap-1'>
                        <Code2 className='w-4 h-4' />
                        <span>{project.techUsed.length} tech</span>
                      </div>
                      {project.githubUrls && project.githubUrls.length > 0 && (
                        <div className='flex items-center gap-1'>
                          <GithubLogoIcon className='w-4 h-4' />
                          <span>
                            {project.githubUrls.length} repo{project.githubUrls.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button asChild variant='outline' size='sm'>
                      <Link to='/projects/$project' params={{ project: project.id }}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          className='bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 text-center border'
          variants={cardVariants}
        >
          <div className='max-w-2xl mx-auto space-y-4'>
            <h2 className='text-2xl font-bold'>Ready to Build Something Amazing?</h2>
            <p className='text-muted-foreground'>
              I'm always excited to work on new challenges and learn emerging technologies. Let's create something
              impactful together.
            </p>
            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <Button asChild>
                <a href='mailto:jonathanqpe@gmail.com' target='_blank' rel='noopener noreferrer'>
                  <Users className='w-4 h-4 mr-2' />
                  Let's Collaborate
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
