import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { BarChart3, TrendingUp, Users, Calendar, MapPin, Clock, Star, Mail, ExternalLink, Layers } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { RESUME } from '@/data/resume'
import { PROJECTS } from '@/data/projects'
import profileImage from '@/assets/profileIcon.jpg'
import { GithubLogoIcon, LinkedinLogoIcon } from '@phosphor-icons/react'
import TechBadgeList from '@/components/TechBadgeList'

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
  const { totalYearsExperience, totalProjects, totalTechnologies } = useMemo(() => {
    const firstJob = RESUME[RESUME.length - 1]

    const parseJobDate = (dateString: string): Date => {
      if (dateString.toLowerCase() === 'present') {
        return new Date()
      }

      const [month, year] = dateString.split(' ')
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthIndex = monthNames.findIndex((m) => month.includes(m))

      if (monthIndex === -1 || !year) {
        console.warn(`Could not parse date: ${dateString}`)
        return new Date()
      }

      return new Date(parseInt(year), monthIndex)
    }

    const startDate = parseJobDate(firstJob.startDate)
    const currentDate = new Date()
    const diffInMilliseconds = currentDate.getTime() - startDate.getTime()
    const diffInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25)

    return {
      totalYearsExperience: Math.floor(diffInYears),
      totalProjects: PROJECTS.length,
      totalTechnologies: Array.from(new Set(RESUME.flatMap((job) => job.techUsed))).length,
    }
  }, [])

  // Mock metrics for dashboard feel
  const metrics = useMemo(
    () => [
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
    ],
    [totalProjects, totalTechnologies, totalYearsExperience],
  )

  const dashboardSections = useMemo(
    () => [
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
    ],
    [],
  )

  return (
    <div className='min-h-screen bg-background p-4 md:p-6 space-y-6'>
      <motion.div variants={containerVariants} initial='hidden' animate='visible' className='max-w-7xl mx-auto'>
        {/* Dashboard Header */}
        <motion.div className='bg-card rounded-xl p-4 md:p-6 shadow-lg border mb-6' variants={cardVariants}>
          <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 md:gap-6'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 w-full lg:w-auto'>
              <div className='relative'>
                <img
                  src={profileImage}
                  alt="Jonathan's profile"
                  className='w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl shadow-lg'
                />
              </div>
              <div className='flex-1'>
                <h1 className='text-2xl md:text-3xl font-bold'>Jonathan Pe</h1>
                <p className='text-base md:text-lg text-muted-foreground'>{currentJob.role}</p>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground'>
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
            <div className='flex flex-wrap gap-2 md:gap-3 w-full lg:w-auto justify-start lg:justify-end'>
              <Button asChild variant='outline' size='sm' className='flex-1 sm:flex-none'>
                <a href='mailto:jonathanqpe@gmail.com' target='_blank' rel='noopener noreferrer'>
                  <Mail className='w-4 h-4 mr-2' />
                  Contact
                </a>
              </Button>
              <Button asChild variant='outline' size='sm' className='flex-1 sm:flex-none'>
                <a href='https://github.com/jonathan-pe' target='_blank' rel='noopener noreferrer'>
                  <GithubLogoIcon className='w-4 h-4 mr-2' />
                  GitHub
                </a>
              </Button>
              <Button asChild variant='outline' size='sm' className='flex-1 sm:flex-none'>
                <a href='https://linkedin.com/in/jonathanqpe' target='_blank' rel='noopener noreferrer'>
                  <LinkedinLogoIcon className='w-4 h-4 mr-2' />
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6'>
          {metrics.map((metric) => (
            <motion.div
              key={metric.label}
              className='bg-card rounded-xl p-4 md:p-6 shadow-lg border'
              variants={cardVariants}
              whileHover={{ y: -2 }}
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm text-muted-foreground'>{metric.label}</p>
                  <p className='text-xl md:text-2xl font-bold'>{metric.value}</p>
                </div>
                <div className={`p-2 md:p-3 rounded-lg bg-muted/50`}>
                  <metric.icon className={`w-5 h-5 md:w-6 md:h-6 text-primary`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Current Status Card */}
        <motion.div className='bg-card rounded-xl p-4 md:p-6 shadow-lg border mb-6' variants={cardVariants}>
          <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4'>
            <div className='flex-1'>
              <h2 className='text-lg md:text-xl font-semibold mb-2'>Current Position</h2>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-primary/10 rounded-lg'>
                  <currentJob.icon.icon className='w-5 h-5 md:w-6 md:h-6 text-primary' />
                </div>
                <div>
                  <p className='font-semibold'>{currentJob.companyName}</p>
                  <p className='text-sm text-muted-foreground'>
                    {currentJob.startDate} - {currentJob.endDate}
                  </p>
                </div>
              </div>
            </div>
            <Button asChild variant='outline' size='sm' className='w-full sm:w-auto'>
              <Link to='/resume/$company' params={{ company: currentJob.id }}>
                Details
              </Link>
            </Button>
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='md:flex-[2]'>
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
            <div className='md:flex-1'>
              <h3 className='font-medium mb-2'>Technologies</h3>
              <TechBadgeList techList={currentJob.techUsed} maxVisible={4} />
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
        <motion.div className='bg-card rounded-xl p-4 md:p-6 shadow-lg border' variants={cardVariants}>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
            <h2 className='text-lg md:text-xl font-semibold'>Recent Projects</h2>
            <Button asChild variant='outline' size='sm' className='w-full sm:w-auto'>
              <Link to='/projects'>View All</Link>
            </Button>
          </div>
          <div className='grid gap-4 md:gap-6 lg:grid-cols-2'>
            {PROJECTS.slice(0, 2).map((project) => (
              <div key={project.id} className='bg-muted/30 rounded-lg p-4 border flex flex-col min-w-0'>
                <div className='flex flex-col gap-3 mb-3'>
                  <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-2'>
                    <h3 className='font-semibold text-base break-words min-w-0 flex-1'>{project.title}</h3>
                    <div className='flex gap-2 flex-shrink-0'>
                      <Button asChild variant='ghost' size='sm' className='text-xs px-2 py-1'>
                        <Link to='/projects/$project' params={{ project: project.id }}>
                          Details
                        </Link>
                      </Button>
                      {project.url && (
                        <Button asChild variant='ghost' size='sm' className='text-xs px-2 py-1'>
                          <a href={project.url} target='_blank' rel='noopener noreferrer'>
                            <ExternalLink className='w-3 h-3' />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <p className='text-sm text-muted-foreground mb-3 flex-grow break-words'>{project.description}</p>
                <div className='mt-auto'>
                  <TechBadgeList techList={project.techUsed} maxVisible={3} className='pb-2' />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HomePage
