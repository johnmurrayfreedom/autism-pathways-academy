# AI Tutor LMS for Autistic Adult Learners

A specialized Learning Management System (LMS) designed to meet the unique needs of autistic adult learners in technology education. This platform combines an AI tutor with accessibility-focused features to create a supportive, personalized learning environment.

## Project Overview

This LMS is designed with the following core principles:

- **Accessibility First**: All components prioritize accessibility for autistic learners
- **Clear Communication**: Consistent, explicit, and predictable interactions
- **Sensory Considerations**: Control over visual and auditory elements
- **Personalization**: Adaptable learning paths and communication styles
- **Reduced Cognitive Load**: Focused learning environments with minimal distractions

## Features

### Onboarding Flow
- Personalized learning goals setup
- Communication style preferences
- Sensory and accessibility preferences

### AI Tutor Interface
- Customizable interaction styles
- Code explanation panel with detailed breakdowns
- Visual support for different learning styles
- Consistent, predictable responses
- Clear next steps and progress tracking

### Course Management
- Structured course listing with clear categorization
- Detailed course view with learning objectives
- Progress tracking and continuation

### Accessible Media
- Video player with sensory controls
- Transcript and caption support
- Playback speed control
- Visual markers for key points

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-tutor-lms.git
cd ai-tutor-lms
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ai-tutor/          # AI Tutor related components
│   │   ├── common/            # Shared UI components
│   │   ├── courses/           # Course listing and detail components
│   │   ├── media/             # Media player components
│   │   └── onboarding/        # Onboarding flow components
│   ├── store/                 # Redux store configuration
│   │   └── slices/            # Redux slices for state management
│   ├── styles/                # Global styles and themes
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
```

## Key Components

### Onboarding Components
- `LearningGoals.tsx`: Helps users define their learning objectives and interests
- `CommunicationPreferences.tsx`: Allows users to specify their preferred interaction methods

### AI Tutor Components
- `AITutorInterface.tsx`: Main container for the AI tutoring experience
- `ChatWindow.tsx`: Displays the conversation between user and AI
- `MessageInput.tsx`: Allows users to send messages and attachments
- `TutorSettingsPanel.tsx`: Controls for customizing the tutor's behavior
- `CodeExplainPanel.tsx`: Provides detailed code explanations
- `VisualSupportPanel.tsx`: Displays diagrams, concept maps, and other visual aids

### Course Components
- `CourseListingView.tsx`: Shows available courses with filtering options
- `CourseDetailView.tsx`: Detailed view of a single course

### Media Components
- `AccessibleVideoPlayer.tsx`: Video player with accessibility features

## Accessibility Considerations

This LMS implements numerous features specifically designed for autistic adult learners:

- **Predictable UI**: Consistent layouts and interaction patterns
- **Sensory Control**: Adjustable brightness, contrast, and volume
- **Clear Communication**: Explicit instructions and feedback
- **Flexibility**: Multiple ways to consume content (video, text, visual)
- **Reduced Overload**: Focused UI with minimal distractions
- **Customization**: User preferences for communication and learning styles

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Developed with input from autistic adults in technology fields
- Built with accessibility as a fundamental design principle
- Created to address the gap in specialized learning tools for neurodivergent learners 