import { createEvent, createStore, sample } from 'effector'
import { delay } from 'patronum'

export type Notification = {
  type: 'success' | 'error' | 'warning'
  message: string
}

export const $notifications = createStore<Array<Notification>>([])

export const show = createEvent<Notification>()

const removeNotifiction = createEvent()

sample({
  clock: show,
  source: $notifications,
  fn(notifications, newNotification) {
    return [...notifications, newNotification]
  },
  target: $notifications,
})

sample({ clock: delay(show, 2000), target: removeNotifiction })

sample({
  clock: removeNotifiction,
  source: $notifications,
  fn(notifications) {
    return notifications.slice(1)
  },
  target: $notifications,
})
