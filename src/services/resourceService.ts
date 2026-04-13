import api from '@/services/api'
import type { ApiResponse } from '@/types/api'
import type { UploadAudioResponse, UploadImageResponse } from '@/types/resource'

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

  uploadImage(file: File) {
    const formData = new FormData()
    formData.append('image', file)

    return api.post<ApiResponse<UploadImageResponse>>('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
