import { useTheme } from 'next-themes'
import React from 'react'

import styles from './gradient.module.css'
interface IGradientWrapperProps {
  children: React.ReactNode
  className?: string
}

// rgba(242, 241, 241, 1) base
// rgba(206, 187, 248, 0.16) top right
// rgba(229, 214, 238, 0.4) left
// rgba(223, 230, 254, 0.72) bottom

const GradientWrapper: React.FC<IGradientWrapperProps> = ({
  children,
  className = ''
}) => {
  const { theme } = useTheme()

  return (
    <div
      className={
        theme === 'light'
          ? `${styles.gradient} ${className}`
          : `${styles.darkgradient} ${className}`
      }
    >
      {children}
    </div>
  )
}

export default GradientWrapper
