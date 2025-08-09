import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Clock,
  Star,
  Mail,
  ExternalLink,
  Database,
  Activity,
  Layers,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { RESUME } from '@/data/resume'
import { PROJECTS } from '@/data/projects'
import { SKILLS } from '@/data/skills'
import profileImage from '@/assets/profileIcon.jpg'
import { GithubLogoIcon, LinkedinLogoIcon } from '@phosphor-icons/react'

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
  const topSkills = SKILLS.filter((skill) => skill.level >= 4)

  // Mock metrics for dashboard feel
  const metrics = [
    {
      label: 'Years Experience',
      value: `${totalYearsExperience}+`,
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      label: 'Companies',
      value: RESUME.length.toString(),
      icon: Users,
      color: 'text-blue-500',
    },
    {
      label: 'Projects',
      value: totalProjects.toString(),
      icon: BarChart3,
      color: 'text-purple-500',
    },
    {
      label: 'Skills Mastered',
      value: topSkills.length.toString(),
      icon: Star,
      color: 'text-yellow-500',
    },
  ]

  const dashboardSections = [
    {
      title: 'Professional Timeline',
      description: 'Explore my career journey across leading tech companies',
      icon: Calendar,
      path: '/resume',
      color: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Project Portfolio',
      description: "Discover applications and solutions I've built",
      icon: Layers,
      path: '/projects',
      color: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-500',
    },
    {
      title: 'About & Skills',
      description: 'Learn about my background and technical expertise',
      icon: Database,
      path: '/about',
      color: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-500',
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
                <div className='absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center'>
                  <Activity className='w-3 h-3 text-white' />
                </div>
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
              <Button variant='outline' size='sm'>
                <Mail className='w-4 h-4 mr-2' />
                Contact
              </Button>
              <Button variant='outline' size='sm'>
                <GithubLogoIcon className='w-4 h-4 mr-2' />
                GitHub
              </Button>
              <Button variant='outline' size='sm'>
                <LinkedinLogoIcon className='w-4 h-4 mr-2' />
                LinkedIn
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
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
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
                View Details
                <ExternalLink className='w-4 h-4 ml-2' />
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
                  <span key={tech} className='px-2 py-1 bg-primary/10 text-primary text-xs rounded-md'>
                    {tech}
                  </span>
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
              <Link to={section.path} className='block h-full'>
                <div
                  className={`bg-gradient-to-br ${section.color} rounded-xl p-6 shadow-lg border h-full flex flex-col justify-between`}
                >
                  <div>
                    <div className='flex items-center gap-4 mb-4'>
                      <div className='p-3 bg-background/80 rounded-lg'>
                        <section.icon className={`w-6 h-6 ${section.iconColor}`} />
                      </div>
                      <div>
                        <h3 className='font-semibold text-lg'>{section.title}</h3>
                      </div>
                    </div>
                    <p className='text-muted-foreground text-sm mb-4 flex-grow'>{section.description}</p>
                  </div>
                  <div className='flex items-center text-sm font-medium mt-auto'>
                    <span>Explore</span>
                    <ExternalLink className='w-4 h-4 ml-2' />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Skills Distribution */}
        <motion.div className='bg-card rounded-xl p-6 shadow-lg border mb-6' variants={cardVariants}>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold'>Skills Distribution</h2>
            <Button asChild variant='outline' size='sm'>
              <Link to='/about'>
                View All
                <ExternalLink className='w-4 h-4 ml-2' />
              </Link>
            </Button>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {topSkills.map((skill) => (
              <div key={skill.id} className='text-center'>
                <div className='relative w-16 h-16 mx-auto mb-2'>
                  <svg className='w-16 h-16 transform -rotate-90'>
                    <circle
                      cx='32'
                      cy='32'
                      r='28'
                      stroke='currentColor'
                      strokeWidth='4'
                      fill='transparent'
                      className='text-muted'
                    />
                    <circle
                      cx='32'
                      cy='32'
                      r='28'
                      stroke='currentColor'
                      strokeWidth='4'
                      fill='transparent'
                      strokeDasharray={`${(skill.level / 5) * 175.929} 175.929`}
                      className='text-primary'
                    />
                  </svg>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <span className='text-xs font-bold'>{skill.level}/5</span>
                  </div>
                </div>
                <p className='text-xs font-medium'>{skill.name}</p>
                <p className='text-xs text-muted-foreground'>{skill.category}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div className='bg-card rounded-xl p-6 shadow-lg border' variants={cardVariants}>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold'>Recent Projects</h2>
            <Button asChild variant='outline' size='sm'>
              <Link to='/projects'>
                View All
                <ExternalLink className='w-4 h-4 ml-2' />
              </Link>
            </Button>
          </div>
          <div className='grid md:grid-cols-2 gap-6'>
            {PROJECTS.slice(0, 2).map((project) => (
              <div key={project.id} className='bg-muted/30 rounded-lg p-4 border'>
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
                <p className='text-sm text-muted-foreground mb-3'>{project.description}</p>
                <div className='flex flex-wrap gap-1'>
                  {project.techUsed.slice(0, 3).map((tech) => (
                    <span key={tech} className='px-2 py-1 bg-primary/10 text-primary text-xs rounded-md'>
                      {tech}
                    </span>
                  ))}
                  {project.techUsed.length > 3 && (
                    <span className='px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md'>
                      +{project.techUsed.length - 3} more
                    </span>
                  )}
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
