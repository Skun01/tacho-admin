export interface VoicevoxSpeakerOption {
  speakerId: number
  characterName: string
  styleName: string
}

export interface VoicevoxPreviewRequest {
  speakerId: number
  text?: string
}

export interface VoicevoxPreviewResponse {
  speakerId: number
  text: string
  audioUrl: string
}
