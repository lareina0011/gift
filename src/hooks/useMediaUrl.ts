import { useEffect, useState } from 'react'
import { getMediaBlob } from '../utils/storage'

export function useMediaUrl(blobKey: string | null) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!blobKey) {
      setUrl(null)
      return
    }

    let objectUrl: string | null = null
    let cancelled = false

    getMediaBlob(blobKey).then((blob) => {
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
