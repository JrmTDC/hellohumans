interface ChatMessage {
     id: string
     idFromServer?: number
     type: 'text' | 'choice'
     content: string
     sender: 'visitor' | 'bot'
     time_sent: number
     url?: string
     chat_bot_name?: string
     chatBotId?: string
     isAIAssistant?: boolean
     isWaitingForAnswer?: boolean
     disableTextInput?: boolean
     aiAssistantResponseType?: 'answer_generated' | 'choice_displayed'
     questionMessageId?: number
}
