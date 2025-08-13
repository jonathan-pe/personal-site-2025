import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  BarChart3,
  Users,
  Star,
  Building2,
  Code2,
  Download,
  ArrowRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { RESUME } from '@/data/resume'
import TechBadgeList from '@/components/TechBadgeList'
import resumePDF from "@/data/Jonathan Pe's Resume.pdf"

const ResumePage = () => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [showCareerDetails, setShowCareerDetails] = useState<boolean>(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const timelineItemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const detailsVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as const,
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as const,
      },
    },
  }

  const toggleJobDetails = (jobId: string) => {
    const isCurrentlyExpanded = expandedJob === jobId
    setExpandedJob(isCurrentlyExpanded ? null : jobId)
    setSelectedJob(isCurrentlyExpanded ? null : jobId)
  }

  // Calculate dashboard metrics
  const totalExperience = (() => {
    const firstJob = RESUME[RESUME.length - 1]
    const startDate = new Date(firstJob.startDate)
    const currentDate = new Date()
    const diffInYears = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    return diffInYears
  })()

  const allTechnologies = Array.from(new Set(RESUME.flatMap((job) => job.techUsed)))
  const totalAccomplishments = RESUME.reduce((total, job) => total + job.accomplishments.length, 0)

  const dashboardMetrics = [
    {
      label: 'Years Experience',
      value: `${totalExperience}+`,
      icon: TrendingUp,
      change: 'Full-Stack Contributor',
      trend: 'up',
    },
    {
      label: 'Companies',
      value: RESUME.length.toString(),
      icon: Building2,
      change: 'Cross-Industry',
      trend: 'up',
    },
    {
      label: 'Technologies',
      value: allTechnologies.length.toString(),
      icon: Code2,
      change: 'Avid Learner',
      trend: 'up',
    },
    {
      label: 'Key Achievements',
      value: totalAccomplishments.toString(),
      icon: Star,
      change: 'Impact Driver',
      trend: 'up',
    },
  ]

  return (
    <div className='min-h-screen bg-background p-4 md:p-6'>
      <motion.div variants={containerVariants} initial='hidden' animate='visible' className='max-w-7xl mx-auto'>
        {/* Dashboard Header */}
        <motion.div className='mb-8' variants={timelineItemVariants}>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
            <div>
              <h1 className='text-2xl md:text-3xl font-bold mb-2'>Career Analytics Dashboard</h1>
              <p className='text-muted-foreground'>Real-time insights into professional growth and experience</p>
            </div>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
              <Button
                variant='outline'
                className='flex items-center gap-2 hover:bg-primary/5 w-full sm:w-auto'
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = resumePDF
                  link.download = 'Jonathan Pe - Resume.pdf'
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}
              >
                <Download className='w-4 h-4' />
                <span>Download Resume</span>
              </Button>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <div className='w-2 h-2 bg-primary rounded-full animate-pulse' />
                <span>Live Data</span>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
            {dashboardMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                className='bg-card rounded-lg p-4 border shadow-sm'
                variants={timelineItemVariants}
                whileHover={{ y: -2 }}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className='flex items-center justify-between mb-2'>
                  <div className='p-2 bg-primary/10 rounded-lg'>
                    <metric.icon className='w-4 h-4 text-primary' />
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      metric.trend === 'up' ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
                <div className='text-2xl font-bold mb-1'>{metric.value}</div>
                <div className='text-sm text-muted-foreground'>{metric.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Career Details Toggle */}
          <div className='flex items-center justify-center mb-8'>
            <Button
              variant='outline'
              onClick={() => setShowCareerDetails(!showCareerDetails)}
              className='flex items-center gap-2 hover:bg-primary/5'
            >
              <BarChart3 className='w-4 h-4' />
              <span>{showCareerDetails ? 'Hide' : 'View'} Career Progression Details</span>
              {showCareerDetails ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
            </Button>
          </div>
        </motion.div>

        {/* Expandable Career Progress Overview */}
        <AnimatePresence>
          {showCareerDetails && (
            <motion.div
              className='bg-card rounded-lg p-6 border shadow-sm mb-8'
              variants={detailsVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
            >
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl font-semibold'>Career Progression Details</h2>
                <div className='flex items-center gap-2'>
                  <BarChart3 className='w-4 h-4 text-muted-foreground' />
                  <span className='text-sm text-muted-foreground'>Growth Analytics</span>
                </div>
              </div>

              <div className='grid md:grid-cols-3 gap-6 mb-6'>
                {/* Career Timeline Stats */}
                <div className='space-y-3'>
                  <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
                    Experience Overview
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Calendar className='w-4 h-4 text-primary' />
                        <span className='text-sm'>Total Positions</span>
                      </div>
                      <span className='font-semibold'>{RESUME.length}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Clock className='w-4 h-4 text-primary' />
                        <span className='text-sm'>Years Active</span>
                      </div>
                      <span className='font-semibold'>{totalExperience}+</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Users className='w-4 h-4 text-primary' />
                        <span className='text-sm'>Current Level</span>
                      </div>
                      <span className='font-semibold'>Senior</span>
                    </div>
                  </div>
                </div>

                {/* Career Growth Metrics */}
                <div className='space-y-3'>
                  <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
                    Growth Trajectory
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>Role Evolution</span>
                      <div className='flex items-center gap-1'>
                        <TrendingUp className='w-3 h-3 text-accent' />
                        <span className='font-semibold text-accent'>Upward</span>
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>Skill Expansion</span>
                      <div className='flex items-center gap-1'>
                        <Code2 className='w-3 h-3 text-accent' />
                        <span className='font-semibold text-accent'>{allTechnologies.length} Tech</span>
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>Industry Impact</span>
                      <div className='flex items-center gap-1'>
                        <Star className='w-3 h-3 text-accent' />
                        <span className='font-semibold text-accent'>High</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Career Highlights */}
                <div className='space-y-3'>
                  <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
                    Key Highlights
                  </h3>
                  <div className='space-y-2 text-sm'>
                    <div className='flex items-start gap-2'>
                      <div className='w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0' />
                      <span>Cross-functional leadership in agile environments</span>
                    </div>
                    <div className='flex items-start gap-2'>
                      <div className='w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0' />
                      <span>Full-stack expertise across modern tech stacks</span>
                    </div>
                    <div className='flex items-start gap-2'>
                      <div className='w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0' />
                      <span>Proven track record of delivering business value</span>
                    </div>
                    <div className='flex items-start gap-2'>
                      <div className='w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0' />
                      <span>Strategic thinking with hands-on execution</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar Visualization */}
              <div className='space-y-3'>
                <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
                  Career Progression
                </h3>
                <div className='relative'>
                  <div className='flex justify-between text-xs text-muted-foreground mb-2'>
                    <span>Junior</span>
                    <span>Mid-Level</span>
                    <span>Senior</span>
                    <span>Lead/Principal</span>
                  </div>
                  <div className='w-full bg-muted rounded-full h-3 relative overflow-hidden'>
                    <motion.div
                      className='bg-gradient-to-r from-primary/60 via-primary to-accent h-3 rounded-full relative'
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
                    >
                      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent animate-pulse' />
                    </motion.div>
                  </div>
                  <div className='flex justify-between text-xs text-muted-foreground mt-1'>
                    <span>0-2y</span>
                    <span>2-5y</span>
                    <span>5-8y</span>
                    <span>8y+</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline */}
        <div className='relative bg-card rounded-lg p-6 border shadow-sm mb-8'>
          <h3 className='text-lg font-semibold mb-6'>Position History</h3>

          {/* Timeline Line */}
          <div className='absolute left-9 top-20 bottom-8 w-0.5 bg-border' />

          {/* Timeline Items */}
          <div className='space-y-6'>
            {RESUME.map((job) => (
              <motion.div key={job.id} variants={timelineItemVariants} className='relative'>
                {/* Timeline Dot */}
                <motion.div
                  className={`absolute left-1 w-4 h-4 rounded-full border-4 border-background z-10 cursor-pointer transition-colors ${
                    selectedJob === job.id || expandedJob === job.id ? 'bg-primary' : 'bg-muted hover:bg-primary/50'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setSelectedJob(selectedJob === job.id ? null : job.id)
                    setExpandedJob(job.id)
                  }}
                />

                {/* Job Card - Dashboard Style */}
                <motion.div
                  className={`ml-12 bg-muted/30 rounded-lg p-4 border cursor-pointer transition-all ${
                    selectedJob === job.id
                      ? 'border-primary/50 bg-primary/5'
                      : 'hover:border-primary/30 hover:bg-muted/50'
                  }`}
                  whileHover={{ y: -1 }}
                  onClick={() => toggleJobDetails(job.id)}
                >
                  {/* Job Header - Compact Dashboard Style */}
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-3'>
                      <Link to='/resume/$company' params={{ company: job.id }}>
                        <div className='p-2 bg-background rounded-md border hover:border-primary/50 transition-colors cursor-pointer group'>
                          <job.icon.icon className='w-5 h-5 text-primary group-hover:scale-110 transition-transform' />
                        </div>
                      </Link>
                      <div>
                        <Link to='/resume/$company' params={{ company: job.id }}>
                          <h4 className='font-semibold text-lg hover:text-primary transition-colors cursor-pointer'>
                            {job.companyName}
                          </h4>
                        </Link>
                        <p className='text-sm text-muted-foreground'>{job.role}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='text-right text-sm'>
                        <div className='text-muted-foreground'>
                          {job.startDate} - {job.endDate}
                        </div>
                      </div>
                      <Button variant='ghost' size='sm'>
                        {expandedJob === job.id ? (
                          <ChevronUp className='w-4 h-4' />
                        ) : (
                          <ChevronDown className='w-4 h-4' />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Tech Stack Preview */}
                  <div className='mb-3'>
                    <TechBadgeList techList={job.techUsed} maxVisible={5} className='pb-2' />
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedJob === job.id && (
                      <motion.div
                        variants={detailsVariants}
                        initial='hidden'
                        animate='visible'
                        exit='exit'
                        className='overflow-hidden'
                      >
                        <div className='border-t pt-4 mt-3 bg-background/50 rounded p-4 -m-1'>
                          <div className='grid md:grid-cols-2 gap-6'>
                            <div>
                              <h5 className='font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground'>
                                Key Accomplishments
                              </h5>
                              <ul className='space-y-2'>
                                {job.accomplishments.map((accomplishment, idx) => (
                                  <li key={idx} className='flex items-start gap-2 text-sm'>
                                    <div className='w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0' />
                                    <span>{accomplishment}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className='flex flex-col justify-center items-center space-y-3'>
                              <div className='text-center'>
                                <h5 className='font-semibold mb-2 text-sm'>Want to learn more?</h5>
                                <p className='text-xs text-muted-foreground mb-4'>
                                  View detailed insights, technology breakdown, and impact analysis
                                </p>
                              </div>
                              <Link to='/resume/$company' params={{ company: job.id }}>
                                <Button className='gap-2' size='sm'>
                                  <ArrowRight className='w-4 h-4' />
                                  View Full Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Analytics Summary */}
        <div className='grid md:grid-cols-2 gap-6'>
          {/* Technology Distribution */}
          <motion.div className='bg-card rounded-lg p-6 border shadow-sm' variants={timelineItemVariants}>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold'>Technology Expertise</h3>
              <Code2 className='w-5 h-5 text-muted-foreground' />
            </div>
            <div className='space-y-3'>
              {allTechnologies
                .map((tech) => ({
                  tech,
                  usage: RESUME.filter((job) => job.techUsed.includes(tech)).length,
                }))
                .sort((a, b) => b.usage - a.usage)
                .slice(0, 6)
                .map(({ tech, usage }, index) => {
                  const percentage = (usage / RESUME.length) * 100
                  return (
                    <div key={tech} className='space-y-1'>
                      <div className='flex justify-between text-sm'>
                        <span>{tech}</span>
                        <span className='text-muted-foreground'>
                          {usage}/{RESUME.length} roles
                        </span>
                      </div>
                      <div className='w-full bg-muted rounded-full h-2'>
                        <motion.div
                          className='bg-primary rounded-full h-2'
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: index * 0.1, duration: 0.8 }}
                        />
                      </div>
                    </div>
                  )
                })}
              <div className='pt-2 text-xs text-muted-foreground'>Showing top technologies by usage frequency</div>
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div className='bg-card rounded-lg p-6 border shadow-sm' variants={timelineItemVariants}>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold'>Impact Metrics</h3>
              <BarChart3 className='w-5 h-5 text-muted-foreground' />
            </div>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-3 bg-primary/5 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <TrendingUp className='w-4 h-4 text-primary' />
                  <span className='font-medium'>Career Progression</span>
                </div>
                <span className='text-primary font-semibold'>Upward</span>
              </div>
              <div className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <Building2 className='w-4 h-4 text-muted-foreground' />
                  <span className='font-medium'>Company Tier</span>
                </div>
                <span className='font-semibold'>Top-tier</span>
              </div>
              <div className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <Star className='w-4 h-4 text-muted-foreground' />
                  <span className='font-medium'>Avg. Achievements</span>
                </div>
                <span className='font-semibold'>{Math.round(totalAccomplishments / RESUME.length)}/role</span>
              </div>
              <div className='pt-2 text-xs text-muted-foreground mt-auto'>
                Based on role complexity and company standards
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default ResumePage
