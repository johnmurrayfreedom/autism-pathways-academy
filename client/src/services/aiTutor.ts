import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
  context: {
    courseId?: number;
    lessonId?: number;
    moduleName?: string;
    lessonTitle?: string;
  };
}

export interface TutorResponse {
  message: string;
  suggestions?: string[];
  resources?: {
    title: string;
    url: string;
  }[];
  needsClarification?: boolean;
}

export interface TutorPreferences {
  communicationStyle: 'direct' | 'conversational' | 'step-by-step';
  responseLength: 'concise' | 'detailed';
  useEmoji: boolean;
  useVisualAids: boolean;
}

class AiTutorService {
  private static instance: AiTutorService;
  private baseUrl: string;
  private preferences: TutorPreferences;

  private constructor() {
    this.baseUrl = `${API_BASE_URL}/api/v1/tutor`;
    this.preferences = {
      communicationStyle: 'direct',
      responseLength: 'concise',
      useEmoji: true,
      useVisualAids: true,
    };
  }

  public static getInstance(): AiTutorService {
    if (!AiTutorService.instance) {
      AiTutorService.instance = new AiTutorService();
    }
    return AiTutorService.instance;
  }

  async sendMessage(
    message: string,
    context?: {
      courseId?: number;
      lessonId?: number;
      moduleName?: string;
      lessonTitle?: string;
    }
  ): Promise<TutorResponse> {
    const response = await axios.post(`${this.baseUrl}/chat`, {
      message,
      context,
      preferences: this.preferences,
    });
    return response.data;
  }

  async getConversationHistory(conversationId: string): Promise<Conversation> {
    const response = await axios.get(`${this.baseUrl}/conversations/${conversationId}`);
    return response.data;
  }

  async updatePreferences(preferences: Partial<TutorPreferences>): Promise<void> {
    this.preferences = { ...this.preferences, ...preferences };
    await axios.put(`${this.baseUrl}/preferences`, this.preferences);
  }

  async getPreferences(): Promise<TutorPreferences> {
    const response = await axios.get(`${this.baseUrl}/preferences`);
    this.preferences = response.data;
    return this.preferences;
  }

  async requestExplanation(
    conceptId: string,
    preferredStyle?: 'text' | 'visual' | 'example'
  ): Promise<TutorResponse> {
    const response = await axios.post(`${this.baseUrl}/explain`, {
      conceptId,
      style: preferredStyle,
      preferences: this.preferences,
    });
    return response.data;
  }

  async provideFeedback(
    lessonId: number,
    feedback: {
      understanding: 'clear' | 'somewhat' | 'unclear';
      pacing: 'too_fast' | 'good' | 'too_slow';
      comments?: string;
    }
  ): Promise<void> {
    await axios.post(`${this.baseUrl}/feedback`, {
      lessonId,
      feedback,
    });
  }
}

export default AiTutorService.getInstance(); 