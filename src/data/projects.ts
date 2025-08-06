import type { Project } from '@/types/projects'

export const PROJECTS: Array<Project> = [
  {
    id: 'personalWebsite',
    title: 'Personal Website',
    url: 'https://jonathanpe.com',
    description: 'Personal Website created to practice various skills and display my interests',
    techUsed: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    id: '5oclock',
    title: "It's 5 O'Clock Somewhere",
    url: 'https://its5oclocksomewhere.club',
    description: "App that shows where in the world it's 5:00pm and suggests a beverage to consume based on location",
    techUsed: ['React', 'styled-components', 'MaterialUI'],
  },
]
