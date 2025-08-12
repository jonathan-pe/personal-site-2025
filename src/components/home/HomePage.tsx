import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { BarChart3, TrendingUp, Users, Calendar, MapPin, Clock, Star, Mail, ExternalLink, Layers } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScrollableContainer } from '@/components/ui/scrollable-container'
import { RESUME } from '@/data/resume'
import { PROJECTS } from '@/data/projects'
import profileImage from '@/assets/profileIcon.jpg'
import { GithubLogoIcon, LinkedinLogoIcon } from '@phosphor-icons/react'
import TechBadge from '@/components/TechBadge'

const HomePage = () => {
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

  const currentJob = RESUME[0]
  const totalYearsExperience = (() => {
    const firstJob = RESUME[RESUME.length - 1] // Assuming RESUME is ordered from newest to oldest
    const startDate = new Date(firstJob.startDate)
    const currentDate = new Date()
    const diffInMilliseconds = currentDate.getTime() - startDate.getTime()
    const diffInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25)
    return Math.floor(diffInYears)
  })()
  const totalProjects = PROJECTS.length
  const totalTechnologies = Array.from(new Set(RESUME.flatMap((job) => job.techUsed))).length

  // Mock metrics for dashboard feel
  const metrics = [
    {
      label: 'Years Experience',
      value: `${totalYearsExperience}+`,
      icon: TrendingUp,
    },
    {
      label: 'Companies',
      value: RESUME.length.toString(),
      icon: Users,
    },
    {
      label: 'Projects',
      value: totalProjects.toString(),
      icon: BarChart3,
    },
    {
      label: 'Technologies',
      value: totalTechnologies.toString(),
      icon: Star,
    },
  ]

  const dashboardSections = [
    {
      title: 'Professional Timeline',
      description: 'Explore my career journey across leading tech companies',
      icon: Calendar,
      path: '/resume',
    },
    {
      title: 'Project Portfolio',
      description: "Discover applications and solutions I've built",
      icon: Layers,
      path: '/projects',
    },
  ]

  return (
    <div className='min-h-screen bg-background p-6 space-y-6'>
      <motion.div variants={containerVariants} initial='hidden' animate='visible' className='max-w-7xl mx-auto'>
        {/* Dashboard Header */}
        <motion.div className='bg-card rounded-xl p-6 shadow-lg border mb-6' variants={cardVariants}>
          <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6'>
            <div className='flex items-center gap-6'>
              <div className='relative'>
                <img
                  src={profileImage}
                  alt="Jonathan's profile"
                  className='w-20 h-20 object-cover rounded-xl shadow-lg'
                />
              </div>
              <div>
                <h1 className='text-3xl font-bold'>Jonathan Pe</h1>
                <p className='text-lg text-muted-foreground'>{currentJob.role}</p>
                <div className='flex items-center gap-4 mt-2 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-1'>
                    <MapPin className='w-4 h-4' />
                    <span>San Francisco Bay Area</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Clock className='w-4 h-4' />
                    <span>Available for opportunities</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex gap-3'>
              <Button asChild variant='outline' size='sm'>
                <a href='mailto:jonathanqpe@gmail.com' target='_blank' rel='noopener noreferrer'>
                  <Mail className='w-4 h-4 mr-2' />
                  Contact
                </a>
              </Button>
              <Button asChild variant='outline' size='sm'>
                <a href='https://github.com/jonathan-pe' target='_blank' rel='noopener noreferrer'>
                  <GithubLogoIcon className='w-4 h-4 mr-2' />
                  GitHub
                </a>
              </Button>
              <Button asChild variant='outline' size='sm'>
                <a href='https://linkedin.com/in/jonathanqpe' target='_blank' rel='noopener noreferrer'>
                  <LinkedinLogoIcon className='w-4 h-4 mr-2' />
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
          {metrics.map((metric) => (
            <motion.div
              key={metric.label}
              className='bg-card rounded-xl p-6 shadow-lg border'
              variants={cardVariants}
              whileHover={{ y: -2 }}
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>{metric.label}</p>
                  <p className='text-2xl font-bold'>{metric.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-muted/50`}>
                  <metric.icon className={`w-6 h-6 text-primary`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Current Status Card */}
        <motion.div className='bg-card rounded-xl p-6 shadow-lg border mb-6' variants={cardVariants}>
          <div className='flex items-start justify-between mb-4'>
            <div>
              <h2 className='text-xl font-semibold mb-2'>Current Position</h2>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-primary/10 rounded-lg'>
                  <currentJob.icon.icon className='w-6 h-6 text-primary' />
                </div>
                <div>
                  <p className='font-semibold'>{currentJob.companyName}</p>
                  <p className='text-sm text-muted-foreground'>
                    {currentJob.startDate} - {currentJob.endDate}
                  </p>
                </div>
              </div>
            </div>
            <Button asChild variant='outline' size='sm'>
              <Link to='/resume/$company' params={{ company: currentJob.id }}>
                Details
              </Link>
            </Button>
          </div>
          <div className='flex flex-wrap md:flex-nowrap gap-4'>
            <div className='flex flex-2/3 flex-col'>
              <h3 className='font-medium mb-2'>Key Accomplishments</h3>
              <ul className='space-y-1 text-sm text-muted-foreground'>
                {currentJob.accomplishments.slice(0, 3).map((accomplishment, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0' />
                    <span>{accomplishment}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className='flex flex-1/3 flex-col'>
              <h3 className='font-medium mb-2'>Technologies</h3>
              <div className='flex flex-wrap gap-2'>
                {currentJob.techUsed.map((tech) => (
                  <TechBadge key={tech} tech={tech} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Dashboard */}
        <div className='flex flex-col md:flex-row gap-6 mb-6'>
          {dashboardSections.map((section) => (
            <motion.div
              key={section.title}
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='flex-1 h-[200px]'
            >
              <Link to={section.path} className='block h-full group'>
                <div
                  className={`bg-card rounded-xl p-6 shadow-lg border h-full flex flex-col justify-between hover:border-primary/50 transition-colors`}
                >
                  <div>
                    <div className='flex items-center gap-4 mb-4'>
                      <div className='p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors'>
                        <section.icon className='w-6 h-6 text-primary' />
                      </div>
                      <div>
                        <h3 className='font-semibold text-lg group-hover:text-primary transition-colors'>
                          {section.title}
                        </h3>
                      </div>
                    </div>
                    <p className='text-muted-foreground text-sm mb-4 flex-grow'>{section.description}</p>
                  </div>
                  <div className='flex items-center justify-between mt-auto'>
                    <span className='text-sm font-medium text-primary'>Explore →</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Projects */}
        <motion.div className='bg-card rounded-xl p-6 shadow-lg border' variants={cardVariants}>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold'>Recent Projects</h2>
            <Button asChild variant='outline' size='sm'>
              <Link to='/projects'>View All</Link>
            </Button>
          </div>
          <div className='grid md:grid-cols-2 gap-6'>
            {PROJECTS.slice(0, 2).map((project) => (
              <div key={project.id} className='bg-muted/30 rounded-lg p-4 border flex flex-col'>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='font-semibold'>{project.title}</h3>
                  <div className='flex gap-2'>
                    <Button asChild variant='ghost' size='sm'>
                      <Link to='/projects/$project' params={{ project: project.id }}>
                        Details
                      </Link>
                    </Button>
                    {project.url && (
                      <Button asChild variant='ghost' size='sm'>
                        <a href={project.url} target='_blank' rel='noopener noreferrer'>
                          <ExternalLink className='w-4 h-4' />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                <p className='text-sm text-muted-foreground mb-3 flex-grow'>{project.description}</p>
                <ScrollableContainer className='mt-auto'>
                  <div className='flex gap-1 pb-2 min-w-fit'>
                    {project.techUsed.map((tech) => (
                      <TechBadge key={tech} tech={tech} />
                    ))}
                  </div>
                </ScrollableContainer>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HomePage
