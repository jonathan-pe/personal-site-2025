// src/components/Hero.tsx
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils' // If using shadcn's cn utility

const name = 'Jonathan Pe'

export const Hero = () => {
  return (
    <section className='relative h-screen flex items-center justify-center overflow-hidden bg-background'>
      {/* Name Text */}
      <h1 className='z-20 text-6xl md:text-9xl font-bold flex font-header text-foreground'>
        {name.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
          >
            {char}
          </motion.span>
        ))}
      </h1>

      {/* Cutout Image Behind Text */}
      <motion.img
        src='/src/assets/cartoon me.png'
        alt='Jonathan Pe'
        className='absolute z-10 bottom-0 h-[60%] md:h-[80%] object-contain'
        initial={{ y: 300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: name.length * 0.1 + 0.5, duration: 1, type: 'spring' }}
      />
    </section>
  )
}
