import { createGlobalStyle } from 'styled-components';
import { Theme } from './themes';

interface GlobalStyleProps {
  theme: Theme;
  reduceMotion: boolean;
}

export const GlobalStyles = createGlobalStyle<GlobalStyleProps>`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    font-size: ${props => props.theme.typography.fontSizeBase}px;
  }

  html {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: ${props => props.theme.typography.fontFamily};
    font-size: ${props => props.theme.typography.fontSizeMd}px;
    line-height: ${props => props.theme.typography.lineHeightNormal};
    color: ${props => props.theme.colors.textPrimary};
    background-color: ${props => props.theme.colors.background};
    min-height: 100%;
    width: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    /* Prevent contents from bouncing while scrolling */
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  /* Set focus styles for all focusable elements */
  :focus {
    outline: ${props => props.theme.borders.borderWidthThick}px solid ${props => props.theme.colors.borderFocus};
    outline-offset: 2px;
  }

  /* Skip-to-main accessibility link */
  .skip-to-content {
    position: absolute;
    top: -40px;
    left: 0;
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.textOnDark};
    padding: ${props => props.theme.spacing.spaceSm}px;
    z-index: 100;
    transition: top 0.2s;

    &:focus {
      top: 0;
    }
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${props => props.theme.typography.fontWeightBold};
    line-height: ${props => props.theme.typography.lineHeightTight};
    margin-bottom: ${props => props.theme.spacing.spaceMd}px;
    color: ${props => props.theme.colors.textPrimary};
  }

  h1 {
    font-size: ${props => props.theme.typography.fontSizeXxl}px;
  }

  h2 {
    font-size: ${props => props.theme.typography.fontSizeXl}px;
  }

  h3 {
    font-size: ${props => props.theme.typography.fontSizeLg}px;
  }

  h4 {
    font-size: ${props => props.theme.typography.fontSizeMd}px;
    font-weight: ${props => props.theme.typography.fontWeightMedium};
  }

  /* Paragraphs and text */
  p {
    margin-bottom: ${props => props.theme.spacing.spaceMd}px;
  }

  /* Links */
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: underline;
    transition: color ${props => props.reduceMotion ? '0ms' : `${props.theme.animations.durationFast}ms`} ${props => props.theme.animations.easeDefault};
    
    &:hover {
      color: ${props => props.theme.colors.accent};
    }
    
    &:focus {
      text-decoration: none;
    }
  }

  /* Lists */
  ul, ol {
    margin-bottom: ${props => props.theme.spacing.spaceMd}px;
    padding-left: ${props => props.theme.spacing.spaceLg}px;
  }

  li {
    margin-bottom: ${props => props.theme.spacing.spaceXs}px;
  }

  /* Buttons */
  button {
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
  }

  /* Animations - respect user preferences for reduced motion */
  ${props => props.reduceMotion ? `
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
  ` : ''}

  /* Code blocks */
  code, pre {
    font-family: ${props => props.theme.typography.fontFamilyCode};
    font-size: ${props => props.theme.typography.fontSizeSm}px;
    background-color: ${props => 
      props.theme.id === 'high-contrast' 
      ? props.theme.colors.surface 
      : props.theme.id === 'dark' 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.05)'
    };
    border-radius: ${props => props.theme.borders.borderRadius}px;
  }

  pre {
    padding: ${props => props.theme.spacing.spaceMd}px;
    overflow-x: auto;
    margin-bottom: ${props => props.theme.spacing.spaceMd}px;
  }

  code {
    padding: ${props => props.theme.spacing.spaceXxs}px ${props => props.theme.spacing.spaceXs}px;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: ${props => props.theme.spacing.spaceMd}px;
  }

  th, td {
    padding: ${props => props.theme.spacing.spaceSm}px;
    text-align: left;
    border-bottom: ${props => props.theme.borders.borderWidth}px solid ${props => props.theme.colors.border};
  }

  th {
    font-weight: ${props => props.theme.typography.fontWeightBold};
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Improve accessibility for form elements */
  label {
    display: block;
    margin-bottom: ${props => props.theme.spacing.spaceXs}px;
    font-weight: ${props => props.theme.typography.fontWeightMedium};
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    padding: ${props => props.theme.spacing.spaceSm}px;
    border: ${props => props.theme.borders.borderWidth}px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borders.borderRadius}px;
    background-color: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.textPrimary};
    width: 100%;
    margin-bottom: ${props => props.theme.spacing.spaceMd}px;
    transition: border-color ${props => props.reduceMotion ? '0ms' : `${props.theme.animations.durationFast}ms`} ${props => props.theme.animations.easeDefault};
    
    &:focus {
      border-color: ${props => props.theme.colors.borderFocus};
    }
  }

  /* Helper classes */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .clear-both {
    clear: both;
  }

  /* Additional accessibility features */
  [aria-busy="true"] {
    cursor: progress;
  }

  [aria-disabled="true"], 
  [disabled] {
    cursor: not-allowed;
  }

  [aria-hidden="true"] {
    display: none;
  }
`; 