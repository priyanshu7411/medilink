// Medicine Reminder Service
let reminderCheckInterval = null

export const reminderService = {
  // Request notification permission
  requestPermission: async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  },

  // Start checking for reminders
  start: () => {
    if (reminderCheckInterval) return

    reminderCheckInterval = setInterval(() => {
      const reminders = JSON.parse(localStorage.getItem('medicationReminders') || '[]')
      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

      reminders.forEach(reminder => {
        if (!reminder.enabled) return

        reminder.times.forEach(time => {
          if (time === currentTime) {
            // Check if already notified today
            const lastNotified = localStorage.getItem(`reminder_notified_${reminder.medicationId}_${time}`)
            const today = new Date().toDateString()

            if (lastNotified !== today) {
              reminderService.showNotification(reminder)
              localStorage.setItem(`reminder_notified_${reminder.medicationId}_${time}`, today)
            }
          }
        })
      })
    }, 60000) // Check every minute
  },

  // Stop checking
  stop: () => {
    if (reminderCheckInterval) {
      clearInterval(reminderCheckInterval)
      reminderCheckInterval = null
    }
  },

  // Show notification
  showNotification: (reminder) => {
    const medication = JSON.parse(localStorage.getItem('patient') || '{}')
      .medications?.find(m => m.id === reminder.medicationId)

    if (!medication) return

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('💊 Medication Reminder', {
        body: `Time to take ${medication.name} (${medication.dosage})`,
        icon: '/vite.svg',
        tag: `reminder_${reminder.medicationId}`,
        requireInteraction: true
      })
    }
  },

  // Save reminder
  saveReminder: (reminder) => {
    const reminders = JSON.parse(localStorage.getItem('medicationReminders') || '[]')
    const existingIndex = reminders.findIndex(r => r.medicationId === reminder.medicationId)
    
    if (existingIndex >= 0) {
      reminders[existingIndex] = reminder
    } else {
      reminders.push(reminder)
    }
    
    localStorage.setItem('medicationReminders', JSON.stringify(reminders))
  },

  // Get reminder for medication
  getReminder: (medicationId) => {
    const reminders = JSON.parse(localStorage.getItem('medicationReminders') || '[]')
    return reminders.find(r => r.medicationId === medicationId)
  }
}

