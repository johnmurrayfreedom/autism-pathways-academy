import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../store';
import { selectUserPreferences } from '../../store/slices/userSlice';
import Button from '../common/Button';

interface VideoSource {
  src: string;
  type: string;
}

interface Caption {
  src: string;
  label: string;
  language: string;
  default?: boolean;
}

interface KeyPoint {
  time: number;
  label: string;
  description?: string;
}

interface AccessibleVideoPlayerProps {
  sources: VideoSource[];
  poster?: string;
  title: string;
  captions?: Caption[];
  transcript?: string;
  keyPoints?: KeyPoint[];
  onComplete?: () => void;
  autoplay?: boolean;
  loop?: boolean;
  startTime?: number;
  endTime?: number;
}

// Main container
const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  position: relative;
`;

// Video title bar
const VideoTitle = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Video container
const VideoContainer = styled.div<{ contrast: number; brightness: number }>`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  filter: contrast(${({ contrast }) => contrast}%) brightness(${({ brightness }) => brightness}%);
`;

// Video element
const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

// Controls container
const ControlsContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
`;

// Primary controls (play, volume, etc.)
const PrimaryControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

// Control group
const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

// Time display
const TimeDisplay = styled.div`
  font-size: 0.9rem;
  font-family: monospace;
  color: ${({ theme }) => theme.colors.text.secondary};
  min-width: 90px;
`;

// Progress container
const ProgressContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  margin-bottom: 1rem;
  position: relative;
  cursor: pointer;
`;

// Progress bar
const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => `${progress}%`};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: width 0.1s;
`;

// Buffer bar
const BufferBar = styled.div<{ buffered: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ buffered }) => `${buffered}%`};
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  z-index: -1;
`;

// Key points markers
const KeyPointMarker = styled.div<{ position: number }>`
  position: absolute;
  top: -3px;
  left: ${({ position }) => `${position}%`};
  width: 3px;
  height: 14px;
  background-color: ${({ theme }) => theme.colors.warning};
  border-radius: 2px;
  cursor: pointer;
  z-index: 2;
  
  &:hover::after {
    content: attr(data-label);
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.primary};
    padding: 4px 8px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    font-size: 0.75rem;
    white-space: nowrap;
    z-index: 3;
  }
`;

// Sensory controls (contrast, brightness, volume)
const SensoryControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

// Slider container
const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 120px;
`;

// Slider label
const SliderLabel = styled.label`
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  justify-content: space-between;
`;

// Slider
const Slider = styled.input`
  width: 100%;
  cursor: pointer;
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

// Tabs container
const TabsContainer = styled.div`
  margin-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

// Tabs
const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

// Tab
const Tab = styled.button<{ isActive: boolean }>`
  padding: 0.75rem 1.25rem;
  background-color: ${({ theme, isActive }) => isActive ? theme.colors.background : 'transparent'};
  border: none;
  border-bottom: 2px solid ${({ theme, isActive }) => isActive ? theme.colors.primary : 'transparent'};
  color: ${({ theme, isActive }) => isActive ? theme.colors.primary : theme.colors.text.secondary};
  font-weight: ${({ theme, isActive }) => isActive ? theme.typography.fontWeights.medium : theme.typography.fontWeights.regular};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: -2px;
  }
  
  .reduced-motion & {
    transition: none;
  }
`;

// Tab content
const TabContent = styled.div`
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
`;

// Transcript content
const TranscriptContent = styled.div`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: pre-wrap;
`;

// Key points content
const KeyPointsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// Key point item
const KeyPointItem = styled.div`
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

// Key point title
const KeyPointTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Key point time
const KeyPointTime = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.hint};
  font-family: monospace;
`;

// Key point description
const KeyPointDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Helper function to format time (seconds to MM:SS)
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const AccessibleVideoPlayer: React.FC<AccessibleVideoPlayerProps> = ({
  sources,
  poster,
  title,
  captions,
  transcript,
  keyPoints,
  onComplete,
  autoplay = false,
  loop = false,
  startTime = 0,
  endTime
}) => {
  // Get user preferences from store
  const userPreferences = useAppSelector(selectUserPreferences);
  
  // Video element ref
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // State for video playback
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(startTime);
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [buffered, setBuffered] = useState<number>(0);
  const [volume, setVolume] = useState<number>(
    userPreferences?.videoVolume !== undefined 
      ? userPreferences.videoVolume 
      : 75
  );
  const [isMuted, setIsMuted] = useState<boolean>(
    userPreferences?.videoMuted !== undefined 
      ? userPreferences.videoMuted 
      : false
  );
  const [playbackRate, setPlaybackRate] = useState<number>(
    userPreferences?.videoPlaybackRate !== undefined 
      ? userPreferences.videoPlaybackRate 
      : 1
  );
  
  // State for sensory controls
  const [brightness, setBrightness] = useState<number>(
    userPreferences?.videoBrightness !== undefined 
      ? userPreferences.videoBrightness 
      : 100
  );
  const [contrast, setContrast] = useState<number>(
    userPreferences?.videoContrast !== undefined 
      ? userPreferences.videoContrast 
      : 100
  );
  
  // State for tabs
  const [activeTab, setActiveTab] = useState<'none' | 'transcript' | 'keypoints'>(
    userPreferences?.preferTranscript === true ? 'transcript' : 'none'
  );
  
  // State for fullscreen mode
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  // Effect to handle initial setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Set initial volume and playback rate
    video.volume = volume / 100;
    video.muted = isMuted;
    video.playbackRate = playbackRate;
    
    // Seek to start time
    video.currentTime = startTime;
    
    // Set up event listeners
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
      
      // End time handling
      if (endTime && video.currentTime >= endTime) {
        video.pause();
        video.currentTime = endTime;
        setIsPlaying(false);
      }
    };
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };
    
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBuffered((bufferedEnd / video.duration) * 100);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) onComplete();
      
      if (loop) {
        video.currentTime = startTime;
        video.play().catch(error => console.error('Error playing video:', error));
        setIsPlaying(true);
      }
    };
    
    // Add event listeners
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('ended', handleEnded);
    
    // Autoplay if enabled
    if (autoplay && !userPreferences?.disableAutoplay) {
      video.play().catch(error => console.error('Error playing video:', error));
      setIsPlaying(true);
    }
    
    // Cleanup
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  // Effect to handle changes to volume, muted state, and playback rate
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.volume = volume / 100;
    video.muted = isMuted;
    video.playbackRate = playbackRate;
  }, [volume, isMuted, playbackRate]);
  
  // Function to toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(error => console.error('Error playing video:', error));
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Function to handle seeking
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const progressContainer = e.currentTarget;
    const rect = progressContainer.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const clickPercentage = (clickPosition / rect.width) * 100;
    const seekTime = (clickPercentage / 100) * duration;
    
    // Enforce end time limit
    if (endTime && seekTime > endTime) {
      video.currentTime = endTime;
    } else {
      video.currentTime = seekTime;
    }
    
    setCurrentTime(video.currentTime);
    setProgress((video.currentTime / duration) * 100);
  };
  
  // Function to toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Function to change volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  
  // Function to change playback rate
  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };
  
  // Function to change brightness
  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrightness(parseInt(e.target.value));
  };
  
  // Function to change contrast
  const handleContrastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContrast(parseInt(e.target.value));
  };
  
  // Function to toggle fullscreen
  const toggleFullscreen = () => {
    const videoContainer = document.getElementById('video-container');
    if (!videoContainer) return;
    
    if (!isFullscreen) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if ((videoContainer as any).webkitRequestFullscreen) {
        (videoContainer as any).webkitRequestFullscreen();
      } else if ((videoContainer as any).mozRequestFullScreen) {
        (videoContainer as any).mozRequestFullScreen();
      } else if ((videoContainer as any).msRequestFullscreen) {
        (videoContainer as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };
  
  // Function to jump to a key point
  const jumpToKeyPoint = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = time;
    setCurrentTime(time);
    setProgress((time / duration) * 100);
    
    // Start playing when jumping to a key point
    if (!isPlaying) {
      video.play().catch(error => console.error('Error playing video:', error));
      setIsPlaying(true);
    }
  };
  
  // Function to reset sensory settings
  const resetSensorySettings = () => {
    setBrightness(100);
    setContrast(100);
    setVolume(75);
    setIsMuted(false);
    setPlaybackRate(1);
  };
  
  // Function to toggle tabs
  const toggleTab = (tab: 'transcript' | 'keypoints') => {
    setActiveTab(activeTab === tab ? 'none' : tab);
  };
  
  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;
      
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
        case 'j':
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 10);
          break;
        case 'ArrowRight':
        case 'l':
          e.preventDefault();
          video.currentTime = Math.min(
            endTime || video.duration, 
            video.currentTime + 10
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(100, volume + 5));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 5));
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, volume, isMuted, isFullscreen, duration, endTime]);
  
  // Effect to monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement !== null ||
        (document as any).webkitFullscreenElement !== null ||
        (document as any).mozFullScreenElement !== null ||
        (document as any).msFullscreenElement !== null
      );
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);
  
  return (
    <Container>
      <VideoTitle>
        <span>{title}</span>
        <div>
          <Button
            variant="text"
            size="small"
            onClick={resetSensorySettings}
            ariaLabel="Reset video settings"
            icon="refresh"
          >
            Reset Settings
          </Button>
        </div>
      </VideoTitle>
      
      <VideoContainer id="video-container" contrast={contrast} brightness={brightness}>
        <Video
          ref={videoRef}
          poster={poster}
          preload="metadata"
          onClick={togglePlay}
          aria-label={title}
        >
          {sources.map((source, index) => (
            <source key={index} src={source.src} type={source.type} />
          ))}
          
          {captions && captions.map((caption, index) => (
            <track
              key={index}
              kind="subtitles"
              src={caption.src}
              label={caption.label}
              srcLang={caption.language}
              default={caption.default}
            />
          ))}
          
          Your browser does not support the video element.
        </Video>
      </VideoContainer>
      
      <ControlsContainer>
        <ProgressContainer onClick={handleSeek}>
          <ProgressBar progress={progress} />
          <BufferBar buffered={buffered} />
          
          {keyPoints && keyPoints.map((point, index) => {
            const position = (point.time / duration) * 100;
            return (
              <KeyPointMarker
                key={index}
                position={position}
                data-label={point.label}
                onClick={(e) => {
                  e.stopPropagation();
                  jumpToKeyPoint(point.time);
                }}
              />
            );
          })}
        </ProgressContainer>
        
        <PrimaryControls>
          <ControlGroup>
            <Button
              variant="icon"
              onClick={togglePlay}
              ariaLabel={isPlaying ? 'Pause' : 'Play'}
              icon={isPlaying ? 'pause' : 'play'}
            />
            
            <Button
              variant="icon"
              onClick={toggleMute}
              ariaLabel={isMuted ? 'Unmute' : 'Mute'}
              icon={isMuted ? 'volume-off' : 'volume-up'}
            />
            
            <SliderContainer style={{ width: '80px' }}>
              <Slider
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
              />
            </SliderContainer>
            
            <TimeDisplay>
              {formatTime(currentTime)} / {formatTime(duration)}
            </TimeDisplay>
          </ControlGroup>
          
          <ControlGroup>
            <Button
              variant="icon"
              onClick={() => toggleTab('transcript')}
              ariaLabel="Toggle transcript"
              icon="list-alt"
              isActive={activeTab === 'transcript'}
            />
            
            {keyPoints && keyPoints.length > 0 && (
              <Button
                variant="icon"
                onClick={() => toggleTab('keypoints')}
                ariaLabel="Toggle key points"
                icon="bookmark"
                isActive={activeTab === 'keypoints'}
              />
            )}
            
            <div>
              <select
                value={playbackRate}
                onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                aria-label="Playback speed"
                style={{
                  padding: '0.25rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>
            
            <Button
              variant="icon"
              onClick={toggleFullscreen}
              ariaLabel={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              icon={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
            />
          </ControlGroup>
        </PrimaryControls>
        
        <SensoryControls>
          <SliderContainer>
            <SliderLabel htmlFor="brightness-slider">
              <span>Brightness</span> 
              <span>{brightness}%</span>
            </SliderLabel>
            <Slider
              id="brightness-slider"
              type="range"
              min="50"
              max="150"
              value={brightness}
              onChange={handleBrightnessChange}
              aria-label="Brightness"
            />
          </SliderContainer>
          
          <SliderContainer>
            <SliderLabel htmlFor="contrast-slider">
              <span>Contrast</span> 
              <span>{contrast}%</span>
            </SliderLabel>
            <Slider
              id="contrast-slider"
              type="range"
              min="50"
              max="150"
              value={contrast}
              onChange={handleContrastChange}
              aria-label="Contrast"
            />
          </SliderContainer>
        </SensoryControls>
      </ControlsContainer>
      
      {(activeTab === 'transcript' || activeTab === 'keypoints') && (
        <TabsContainer>
          <Tabs>
            {transcript && (
              <Tab 
                isActive={activeTab === 'transcript'} 
                onClick={() => toggleTab('transcript')}
              >
                Transcript
              </Tab>
            )}
            
            {keyPoints && keyPoints.length > 0 && (
              <Tab 
                isActive={activeTab === 'keypoints'} 
                onClick={() => toggleTab('keypoints')}
              >
                Key Points
              </Tab>
            )}
          </Tabs>
          
          <TabContent>
            {activeTab === 'transcript' && transcript && (
              <TranscriptContent>
                {transcript}
              </TranscriptContent>
            )}
            
            {activeTab === 'keypoints' && keyPoints && (
              <KeyPointsContent>
                {keyPoints.map((point, index) => (
                  <KeyPointItem 
                    key={index}
                    onClick={() => jumpToKeyPoint(point.time)}
                  >
                    <KeyPointTitle>
                      {point.label}
                      <KeyPointTime>{formatTime(point.time)}</KeyPointTime>
                    </KeyPointTitle>
                    
                    {point.description && (
                      <KeyPointDescription>
                        {point.description}
                      </KeyPointDescription>
                    )}
                  </KeyPointItem>
                ))}
              </KeyPointsContent>
            )}
          </TabContent>
        </TabsContainer>
      )}
    </Container>
  );
};

export default AccessibleVideoPlayer; 