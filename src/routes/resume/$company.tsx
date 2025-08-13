import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  Star,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  BarChart3,
  GitBranch,
  Award,
  Code2,
  TrendingUp,
} from 'lucide-react'

import { RESUME } from '@/data/resume'
import { Button } from '@/components/ui/button'
import TechBadge from '@/components/TechBadge'
import { getTechFocus, getTechCategory, calculateStackComplexity } from '@/data/techCategories'
import { categorizeAccomplishments, getAccomplishmentStats } from '@/data/accomplishmentCategories'
import { analyzeRole } from '@/data/roleAnalysis'
import { useIsMobile } from '@/hooks/useMobile'

export const Route = createFileRoute('/resume/$company')({
  loader: ({ params }) => {
    const job = RESUME.find((j) => j.id === params.company)
    if (!job) {
      throw notFound()
    }
    return { job }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { job } = Route.useLoaderData()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']))
  const [isScrolled, setIsScrolled] = useState(false)
  const isMobile = useIsMobile()

  // Scroll detection for header compression
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate career context
  const currentJobIndex = RESUME.findIndex((j) => j.id === job.id)
  const isCurrentRole = job.endDate === 'Present'
  const previousJob = currentJobIndex < RESUME.length - 1 ? RESUME[currentJobIndex + 1] : null
  const nextJob = currentJobIndex > 0 ? RESUME[currentJobIndex - 1] : null

  // Calculate role duration
  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = end === 'Present' ? new Date() : new Date(end)
    const months = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    if (years > 0 && remainingMonths > 0) {
      return `${years}y ${remainingMonths}m`
    } else if (years > 0) {
      return `${years}y`
    } else {
      return `${months}m`
    }
  }

  const duration = calculateDuration(job.startDate, job.endDate)

  // Dynamic analysis using new systems
  const techFocus = getTechFocus(job.techUsed)
  const roleContext = analyzeRole(job)
  const stackComplexity = calculateStackComplexity(job.techUsed)
  const categorizedAccomplishments = categorizeAccomplishments(job.accomplishments)
  const accomplishmentStats = getAccomplishmentStats(categorizedAccomplishments)

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const sectionVariants = {
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

  return (
    <motion.div className='min-h-screen bg-background' variants={containerVariants} initial='hidden' animate='visible'>
      {/* Header with Back Navigation - Full width background */}
      <motion.div className='border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10' variants={itemVariants}>
        <div className='max-w-7xl mx-auto p-4 md:p-6'>
          <div className='flex items-center gap-3 md:gap-4 mb-3 md:mb-4'>
            <Link to='/resume'>
              <Button variant='ghost' size='sm' className='gap-2'>
                <ArrowLeft className='w-4 h-4' />
                <span className='hidden sm:inline'>Back to Resume</span>
                <span className='sm:hidden'>Back</span>
              </Button>
            </Link>
            {isCurrentRole && (
              <div className='flex items-center gap-2 px-2 md:px-3 py-1 bg-accent/20 text-accent rounded-full text-xs md:text-sm'>
                <div className='w-1.5 h-1.5 md:w-2 md:h-2 bg-accent rounded-full animate-pulse' />
                <span className='hidden sm:inline'>Current Role</span>
                <span className='sm:hidden'>Current</span>
              </div>
            )}
          </div>

          <div className='flex items-start gap-3 md:gap-6'>
            <motion.div
              className='relative flex-shrink-0'
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <a href={job.icon.href} target='_blank' rel='noopener noreferrer'>
                <div className='p-1.5 md:p-2 bg-background rounded-md border hover:border-primary/50 transition-colors cursor-pointer group'>
                  <job.icon.icon className='w-12 h-12 md:w-20 md:h-20 text-primary group-hover:scale-110 transition-transform' />
                </div>
              </a>
            </motion.div>

            <div className='flex-1 space-y-2 md:space-y-3 min-w-0'>
              <div>
                <h1 className='text-2xl md:text-4xl font-bold tracking-tight leading-tight'>{job.companyName}</h1>
                <p className='text-lg md:text-xl text-muted-foreground font-medium leading-tight'>{job.role}</p>
              </div>

              <div className='flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6 text-xs md:text-sm'>
                <div className='flex items-center gap-2'>
                  <Calendar className='w-3 h-3 md:w-4 md:h-4 text-muted-foreground' />
                  <span>
                    {job.startDate} - {job.endDate}
                  </span>
                </div>
                <AnimatePresence mode='wait'>
                  {(!isMobile || !isScrolled) && (
                    <motion.div
                      key='metadata'
                      initial={{ opacity: 0, height: 0, x: -10 }}
                      animate={{ opacity: 1, height: 'auto', x: 0 }}
                      exit={{ opacity: 0, height: 0, x: -10 }}
                      transition={{
                        duration: 0.3,
                        ease: 'easeInOut',
                        height: { duration: 0.2 },
                      }}
                      className='flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6 overflow-hidden'
                    >
                      <div className='flex items-center gap-2'>
                        <Clock className='w-3 h-3 md:w-4 md:h-4 text-muted-foreground' />
                        <span>{duration}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <BarChart3 className='w-3 h-3 md:w-4 md:h-4 text-muted-foreground' />
                        <span>
                          Position #{RESUME.length - currentJobIndex} of {RESUME.length}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Career progression context */}
              {(previousJob || nextJob) && (
                <div className='flex items-center gap-3 md:gap-4 pt-1 md:pt-2'>
                  <GitBranch className='w-3 h-3 md:w-4 md:h-4 text-muted-foreground flex-shrink-0' />
                  <div className='flex items-center gap-2 text-xs md:text-sm text-accent min-w-0'>
                    {previousJob && (
                      <Link
                        to='/resume/$company'
                        params={{ company: previousJob.id }}
                        className='hover:text-foreground transition-colors truncate'
                      >
                        ← {previousJob.companyName}
                      </Link>
                    )}
                    {previousJob && nextJob && <span className='text-muted-foreground'>•</span>}
                    {nextJob && (
                      <Link
                        to='/resume/$company'
                        params={{ company: nextJob.id }}
                        className='hover:text-foreground transition-colors truncate'
                      >
                        {nextJob.companyName} →
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content - Constrained width */}
      <div className='max-w-7xl mx-auto'>
        <div className='p-4 md:p-6 space-y-6 md:space-y-8'>
          {/* Role Overview Section */}
          <motion.div className='bg-card rounded-lg border shadow-sm overflow-hidden' variants={itemVariants}>
            <button
              onClick={() => toggleSection('overview')}
              className='w-full p-4 md:p-6 flex items-center justify-between hover:bg-muted/50 transition-colors'
            >
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-primary/10 rounded-lg'>
                  <Star className='w-4 h-4 md:w-5 md:h-5 text-primary' />
                </div>
                <div className='text-left'>
                  <h2 className='text-lg md:text-xl font-semibold'>Role Overview</h2>
                  <p className='text-xs md:text-sm text-muted-foreground'>Impact highlights and key metrics</p>
                </div>
              </div>
              {expandedSections.has('overview') ? (
                <ChevronUp className='w-4 h-4 md:w-5 md:h-5 text-muted-foreground' />
              ) : (
                <ChevronDown className='w-4 h-4 md:w-5 md:h-5 text-muted-foreground' />
              )}
            </button>

            <AnimatePresence>
              {expandedSections.has('overview') && (
                <motion.div
                  variants={sectionVariants}
                  initial='hidden'
                  animate='visible'
                  exit='exit'
                  className='overflow-hidden'
                >
                  <div className='px-4 md:px-6 pb-4 md:pb-6 border-t bg-muted/20'>
                    <div className='grid md:grid-cols-3 gap-4 md:gap-6 pt-4 md:pt-6'>
                      {/* Key metrics */}
                      <div className='space-y-4'>
                        <h3 className='font-semibold text-sm uppercase tracking-wide text-muted-foreground'>
                          Impact Metrics
                        </h3>
                        <div className='space-y-3'>
                          <div className='flex items-center justify-between p-3 bg-background rounded-lg border'>
                            <div className='flex items-center gap-2'>
                              <Award className='w-4 h-4 text-primary' />
                              <span className='text-sm'>Accomplishments</span>
                            </div>
                            <span className='font-bold'>{job.accomplishments.length}</span>
                          </div>
                          <div className='flex items-center justify-between p-3 bg-background rounded-lg border'>
                            <div className='flex items-center gap-2'>
                              <Code2 className='w-4 h-4 text-primary' />
                              <span className='text-sm'>Technologies</span>
                            </div>
                            <span className='font-bold'>{job.techUsed.length}</span>
                          </div>
                          <div className='flex items-center justify-between p-3 bg-background rounded-lg border'>
                            <div className='flex items-center gap-2'>
                              <TrendingUp className='w-4 h-4 text-primary' />
                              <span className='text-sm'>Impact Score</span>
                            </div>
                            <span className='font-bold'>{accomplishmentStats.impactPercentage}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Technology breakdown */}
                      <div className='space-y-4'>
                        <h3 className='font-semibold text-sm uppercase tracking-wide text-muted-foreground'>
                          Tech Stack
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                          {job.techUsed.map((tech, index) => (
                            <motion.div
                              key={`${tech}-${job.id}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <TechBadge tech={tech} />
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Role context */}
                      <div className='space-y-4'>
                        <h3 className='font-semibold text-sm uppercase tracking-wide text-muted-foreground'>
                          Career Context
                        </h3>
                        <div className='space-y-2 text-sm'>
                          <div className='flex items-start gap-2'>
                            <div className='w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0' />
                            <span>{roleContext.description}</span>
                          </div>
                          <div className='flex items-start gap-2'>
                            <div className='w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0' />
                            <span>Top focus: {accomplishmentStats.topCategories[0]?.category || 'Development'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Detailed Accomplishments Section */}
          <motion.div className='bg-card rounded-lg border shadow-sm overflow-hidden' variants={itemVariants}>
            <button
              onClick={() => toggleSection('accomplishments')}
              className='w-full p-4 md:p-6 flex items-center justify-between hover:bg-muted/50 transition-colors'
            >
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-primary/10 rounded-lg'>
                  <Target className='w-4 h-4 md:w-5 md:h-5 text-primary' />
                </div>
                <div className='text-left'>
                  <h2 className='text-lg md:text-xl font-semibold'>Key Accomplishments</h2>
                  <p className='text-xs md:text-sm text-muted-foreground'>
                    Detailed breakdown of impact and achievements
                  </p>
                </div>
              </div>
              {expandedSections.has('accomplishments') ? (
                <ChevronUp className='w-4 h-4 md:w-5 md:h-5 text-muted-foreground' />
              ) : (
                <ChevronDown className='w-4 h-4 md:w-5 md:h-5 text-muted-foreground' />
              )}
            </button>

            <AnimatePresence>
              {expandedSections.has('accomplishments') && (
                <motion.div
                  variants={sectionVariants}
                  initial='hidden'
                  animate='visible'
                  exit='exit'
                  className='overflow-hidden'
                >
                  <div className='px-4 md:px-6 pb-4 md:pb-6 border-t bg-muted/20'>
                    <div className='pt-4 md:pt-6 space-y-3 md:space-y-4'>
                      {categorizedAccomplishments.map((accomplishment, index) => (
                        <motion.div
                          key={`${accomplishment.id}-${job.id}`}
                          className='group p-4 bg-background rounded-lg border hover:border-primary/30 transition-colors'
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: index * 0.03,
                            type: 'spring',
                            stiffness: 200,
                            damping: 20,
                          }}
                        >
                          <div className='flex items-start gap-4'>
                            <div className='p-2 rounded-lg bg-primary/10'>
                              <accomplishment.category.icon className='w-4 h-4 text-primary' />
                            </div>
                            <div className='flex-1'>
                              <p className='text-sm leading-relaxed'>{accomplishment.text}</p>
                              <div className='flex items-center gap-3 mt-2'>
                                <span className='text-xs px-2 py-1 rounded-full bg-accent/10 text-accent'>
                                  {accomplishment.category.name}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    accomplishment.impact === 'high'
                                      ? 'bg-green-500/10 text-green-600'
                                      : accomplishment.impact === 'medium'
                                      ? 'bg-yellow-500/10 text-yellow-600'
                                      : 'bg-muted text-muted-foreground'
                                  }`}
                                >
                                  {accomplishment.impact} impact
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Technology Deep Dive Section */}
          <motion.div className='bg-card rounded-lg border shadow-sm overflow-hidden' variants={itemVariants}>
            <button
              onClick={() => toggleSection('technology')}
              className='w-full p-4 md:p-6 flex items-center justify-between hover:bg-muted/50 transition-colors'
            >
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-primary/10 rounded-lg'>
                  <Code2 className='w-4 h-4 md:w-5 md:h-5 text-primary' />
                </div>
                <div className='text-left'>
                  <h2 className='text-lg md:text-xl font-semibold'>Technology Deep Dive</h2>
                  <p className='text-xs md:text-sm text-muted-foreground'>Technical stack and implementation details</p>
                </div>
              </div>
              {expandedSections.has('technology') ? (
                <ChevronUp className='w-4 h-4 md:w-5 md:h-5 text-muted-foreground' />
              ) : (
                <ChevronDown className='w-4 h-4 md:w-5 md:h-5 text-muted-foreground' />
              )}
            </button>

            <AnimatePresence>
              {expandedSections.has('technology') && (
                <motion.div
                  variants={sectionVariants}
                  initial='hidden'
                  animate='visible'
                  exit='exit'
                  className='overflow-hidden'
                >
                  <div className='px-4 md:px-6 pb-4 md:pb-6 border-t bg-muted/20'>
                    <div className='pt-4 md:pt-6 grid md:grid-cols-2 gap-4 md:gap-6'>
                      {/* Technology categories */}
                      <div className='space-y-4'>
                        <h3 className='font-semibold text-sm uppercase tracking-wide text-muted-foreground'>
                          Technology Stack
                        </h3>
                        <div className='grid gap-3'>
                          {job.techUsed.map((tech, index) => (
                            <motion.div
                              key={`${tech}-${job.id}`}
                              className='flex items-center justify-between p-3 bg-background rounded-lg border'
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <div className='flex items-center gap-3'>
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <TechBadge tech={tech} />
                                </motion.div>
                              </div>
                              <div className='text-xs text-muted-foreground'>{getTechCategory(tech).name}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Technical insights */}
                      <div className='space-y-4'>
                        <h3 className='font-semibold text-sm uppercase tracking-wide text-muted-foreground'>
                          Technical Insights
                        </h3>
                        <div className='space-y-3'>
                          <div className='p-4 bg-background rounded-lg border'>
                            <div className='flex items-center gap-2 mb-2'>
                              <Zap className='w-4 h-4 text-primary' />
                              <span className='font-medium text-sm'>Tech Focus</span>
                            </div>
                            <p className='text-sm text-muted-foreground'>{techFocus.description}</p>
                          </div>
                          <div className='p-4 bg-background rounded-lg border'>
                            <div className='flex items-center gap-2 mb-2'>
                              <BarChart3 className='w-4 h-4 text-primary' />
                              <span className='font-medium text-sm'>Stack Complexity</span>
                            </div>
                            <div className='w-full bg-muted rounded-full h-2 mb-2'>
                              <motion.div
                                className='bg-primary rounded-full h-2'
                                initial={{ width: 0 }}
                                animate={{ width: `${stackComplexity.score}%` }}
                                transition={{ delay: 0.5, duration: 1 }}
                              />
                            </div>
                            <p className='text-xs text-muted-foreground'>
                              {stackComplexity.level} - {stackComplexity.description} ({job.techUsed.length}{' '}
                              technologies)
                            </p>
                          </div>
                          <div className='p-4 bg-background rounded-lg border'>
                            <div className='flex items-center gap-2 mb-3'>
                              <GitBranch className='w-4 h-4 text-primary' />
                              <span className='font-medium text-sm'>Frontend/Backend Split</span>
                            </div>
                            <div className='space-y-3'>
                              <div className='flex items-center justify-between text-xs mb-2'>
                                <span className='text-primary font-medium'>Frontend {job.stackFocus.frontend}%</span>
                                <span className='text-accent font-medium'>Backend {job.stackFocus.backend}%</span>
                              </div>
                              <div className='w-full bg-muted rounded-full h-3 overflow-hidden relative'>
                                <motion.div
                                  className='bg-primary h-full absolute left-0 top-0'
                                  initial={{ width: 0 }}
                                  animate={{ width: `${job.stackFocus.frontend}%` }}
                                  transition={{ delay: 0.5, duration: 1, ease: 'easeInOut' }}
                                />
                                <motion.div
                                  className='bg-accent h-full absolute right-0 top-0'
                                  initial={{ width: 0 }}
                                  animate={{ width: `${job.stackFocus.backend}%` }}
                                  transition={{ delay: 0.5, duration: 1, ease: 'easeInOut' }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
