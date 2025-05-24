import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import ApperIcon from './ApperIcon'

export default function MainFeature() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: 'personal'
  })
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { value: 'high', label: 'High', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' }
  ]

  const categories = [
    { value: 'personal', label: 'Personal', icon: 'User', color: 'text-primary' },
    { value: 'work', label: 'Work', icon: 'Briefcase', color: 'text-secondary' },
    { value: 'shopping', label: 'Shopping', icon: 'ShoppingCart', color: 'text-accent' },
    { value: 'health', label: 'Health', icon: 'Heart', color: 'text-red-500' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    const task = {
      id: Date.now().toString(),
      ...newTask,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setTasks(prev => [...prev, task])
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      category: 'personal'
    })
    setIsFormOpen(false)
    toast.success('Task created successfully!')
  }

  const toggleTaskStatus = (taskId) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === 'completed' ? 'todo' : 'completed',
              updatedAt: new Date().toISOString()
            }
          : task
      )
    )
    toast.success('Task updated!')
  }

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  const getPriorityConfig = (priority) => {
    return priorities.find(p => p.value === priority) || priorities[1]
  }

  const getCategoryConfig = (category) => {
    return categories.find(c => c.value === category) || categories[0]
  }

  const getDateLabel = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'MMM dd')
  }

  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesFilter = filter === 'all' || task.status === filter
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'todo').length,
    overdue: tasks.filter(t => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== 'completed').length
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Task Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: 'Total Tasks', value: taskStats.total, icon: 'List', color: 'primary' },
          { label: 'Completed', value: taskStats.completed, icon: 'CheckCircle', color: 'accent' },
          { label: 'Pending', value: taskStats.pending, icon: 'Clock', color: 'secondary' },
          { label: 'Overdue', value: taskStats.overdue, icon: 'AlertCircle', color: 'red-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="glass-effect p-4 lg:p-6 rounded-xl border shadow-soft"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-surface-800 dark:text-surface-200">
                  {stat.value}
                </p>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  {stat.label}
                </p>
              </div>
              <ApperIcon name={stat.icon} className={`h-6 w-6 lg:h-8 lg:w-8 text-${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-effect p-6 rounded-2xl border shadow-soft mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Tasks</option>
              <option value="todo">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="created">Sort by Created</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
            >
              <ApperIcon name="Plus" className="h-5 w-5" />
              <span className="hidden sm:inline">Add Task</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-4"
      >
        <AnimatePresence>
          {filteredAndSortedTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="h-12 w-12 text-surface-400" />
              </div>
              <h3 className="text-xl font-semibold text-surface-600 dark:text-surface-400 mb-2">
                No tasks found
              </h3>
              <p className="text-surface-500 dark:text-surface-500 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first task to get started'}
              </p>
              {!searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFormOpen(true)}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                >
                  <ApperIcon name="Plus" className="h-5 w-5" />
                  <span>Create Your First Task</span>
                </motion.button>
              )}
            </motion.div>
          ) : (
            filteredAndSortedTasks.map((task, index) => {
              const priorityConfig = getPriorityConfig(task.priority)
              const categoryConfig = getCategoryConfig(task.category)
              const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed'

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`glass-effect p-6 rounded-2xl border shadow-soft group hover:shadow-card transition-all duration-300 ${
                    task.status === 'completed' ? 'opacity-75' : ''
                  } ${isOverdue ? 'ring-2 ring-red-300 dark:ring-red-700' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        task.status === 'completed'
                          ? 'bg-accent border-accent text-white'
                          : 'border-surface-300 dark:border-surface-600 hover:border-accent'
                      }`}
                    >
                      {task.status === 'completed' && (
                        <ApperIcon name="Check" className="h-4 w-4" />
                      )}
                    </motion.button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <h3 className={`text-lg font-semibold ${
                          task.status === 'completed'
                            ? 'line-through text-surface-500 dark:text-surface-500'
                            : 'text-surface-800 dark:text-surface-200'
                        }`}>
                          {task.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Priority Badge */}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.color}`}>
                            {priorityConfig.label}
                          </span>
                          
                          {/* Category Badge */}
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-surface-100 dark:bg-surface-800 ${categoryConfig.color}`}>
                            <ApperIcon name={categoryConfig.icon} className="h-3 w-3" />
                            {categoryConfig.label}
                          </span>
                        </div>
                      </div>

                      {task.description && (
                        <p className={`text-sm mb-3 ${
                          task.status === 'completed'
                            ? 'line-through text-surface-400 dark:text-surface-600'
                            : 'text-surface-600 dark:text-surface-400'
                        }`}>
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        {/* Due Date */}
                        {task.dueDate && (
                          <div className={`inline-flex items-center gap-1 text-sm ${
                            isOverdue
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-surface-500 dark:text-surface-500'
                          }`}>
                            <ApperIcon name="Calendar" className="h-4 w-4" />
                            <span>Due {getDateLabel(task.dueDate)}</span>
                            {isOverdue && (
                              <ApperIcon name="AlertCircle" className="h-4 w-4 ml-1" />
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteTask(task.id)}
                          className="self-start sm:self-auto text-surface-400 hover:text-red-500 transition-colors duration-200 p-1"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </motion.div>

      {/* Task Creation Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsFormOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 w-full max-w-md max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-200">
                      Create New Task
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsFormOpen(false)}
                      className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                    >
                      <ApperIcon name="X" className="h-6 w-6" />
                    </motion.button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Task Title *
                      </label>
                      <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        placeholder="What needs to be done?"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Add any additional details..."
                      />
                    </div>

                    {/* Priority and Category */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Priority
                        </label>
                        <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                          className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        >
                          {priorities.map(priority => (
                            <option key={priority.value} value={priority.value}>
                              {priority.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Category
                        </label>
                        <select
                          value={newTask.category}
                          onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                          className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        >
                          {categories.map(category => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="flex-1 px-6 py-3 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-all duration-300"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                      >
                        Create Task
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}