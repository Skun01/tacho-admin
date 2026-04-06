import api from '@/services/api'
import type { ApiResponse } from '@/types/api'
import type { UploadAudioResponse } from '@/types/resource'

export const resourceService = {
  uploadAudio(file: File) {
    const formData = new FormData()
    formData.append('audio', file)

    return api.post<ApiResponse<UploadAudioResponse>>('/uploads/audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
