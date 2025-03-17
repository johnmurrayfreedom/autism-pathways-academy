import apiClient, { handleApiError } from './api';

export interface Message {
  id: number;
  content: string;
  is_user: boolean;
  created_at: string;
}

export interface AITutorResponse {
  message: string;
  conversation_id: string;
  message_type: 'text' | 'error' | 'code' | 'image';
}

const AITutorService = {
  /**
   * Send a message to the AI tutor
   */
  async sendMessage(
    message: string, 
    conversationId?: string, 
    context?: Record<string, any>
  ): Promise<AITutorResponse> {
    try {
      const response = await apiClient.post<AITutorResponse>('/ai-tutor/chat', {
        message,
        conversation_id: conversationId,
        context
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get all conversation IDs for the current user
   */
  async getConversations(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>('/ai-tutor/conversations');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get the message history for a specific conversation
   */
  async getConversationHistory(conversationId: string): Promise<Message[]> {
    try {
      const response = await apiClient.get<Message[]>(`/ai-tutor/conversation/${conversationId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};

export default AITutorService; 