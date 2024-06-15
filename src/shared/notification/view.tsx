import { useUnit } from 'effector-react'
import { $notifications } from './model'
import { cva } from 'class-variance-authority'

const styles = cva('w-56 px-1 py-2 border-2 rounded text-center bg-input', {
  variants: {
    type: {
      success: 'border-green-400 text-green-400 ',
      error: 'border-red-400 text-red-400',
      warning: '',
    },
  },
})

export function View() {
  const notifictions = useUnit($notifications)

  return (
    <div className="absolute top-1 right-1 z-10 flex gap-1 flex-col">
      {notifictions.reverse().map((notification) => (
        <div className={styles({ type: notification.type })}>
          {notification.message}
        </div>
      ))}
    </div>
  )
}
