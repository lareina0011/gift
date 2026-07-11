import { useEffect, useState } from 'react'
import { apiBlob } from '../api/client'

export function useMediaUrl(blobKey: string | null) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!blobKey) {
      setUrl(null)
      return
    }

    let objectUrl: string | null = null
    let cancelled = false

    apiBlob(`/api/media/${blobKey}`).then((blob) => {
      if (cancelled || !blob) return
      objectUrl = URL.createObjectURL(blob)
      setUrl(objectUrl)
    })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [blobKey])

  return url
}
