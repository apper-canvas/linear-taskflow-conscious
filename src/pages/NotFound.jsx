import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-75 animate-pulse"></div>
            <div className="relative bg-white dark:bg-surface-800 rounded-full p-8 shadow-soft flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="h-16 w-16 text-secondary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-surface-800 dark:text-surface-200 mb-6">
            Page Not Found
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8 leading-relaxed">
            Oops! The page you're looking for seems to have wandered off. 
            Let's get you back on track with your productivity journey.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 focus-ring"
            >
              <ApperIcon name="Home" className="h-5 w-5" />
              <span>Return Home</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}