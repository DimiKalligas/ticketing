'use client'

import { useServerToast } from '@/hooks/useServerToast'

type ToastProps = {
  message?: string
  description?: string
  type?: 'success' | 'error' | 'info' | 'warning' | 'default'
  duration?: number
}

export function ToastClient(props: ToastProps) {
    return <p>{props.message}</p>
//   useServerToast(props)
//   return null
}