import api from '@/services/api'
import type { ApiResponse } from '@/types/api'
import type { VoicevoxPreviewRequest, VoicevoxPreviewResponse, VoicevoxSpeakerOption } from '@/types/voicevox'

export const voicevoxService = {
  getSpeakers() {
    return api.get<ApiResponse<VoicevoxSpeakerOption[]>>('/voicevox/speakers')
  },

  preview(payload: VoicevoxPreviewRequest) {
    return api.post<ApiResponse<VoicevoxPreviewResponse>>('/voicevox/preview', payload)
  },
}
