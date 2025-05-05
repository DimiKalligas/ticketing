'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default'

type ToastOptions = {
  message?: string
  description?: string
  type?: ToastType
  duration?: number
}

export function useServerToast(options?: ToastOptions) {
    useEffect(() => {
        if (!options?.message) return
      
        const type: ToastType = options.type || 'default'
      
        const toastMap: Record<ToastType, typeof toast> = {
          success: toast.success,
          error: toast.error,
          info: toast.info,
          warning: toast.warning,
          default: toast,
        }
      
        toastMap[options.type || 'default'](options.message, {
          description: options.description,
          duration: options.duration,
        })
      }, [options])
  }