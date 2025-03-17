import { createGlobalStyle } from 'styled-components';
import { Theme } from './themes';

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  /* CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Set base font size based on theme but allow user override */
  html {
    font-size: ${({ theme }) => theme.typography.fontSizeBase}px;
    height: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: 1.5;
    min-height: 100%;
    transition: background-color ${({ theme }) => theme.transitions.medium}, 
                color ${({ theme }) => theme.transitions.medium};
  }

  /* For users with dyslexia */
  .font-dyslexic {
    font-family: 'OpenDyslexic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    letter-spacing: 0.05em;
    word-spacing: 0.1em;
  }

  /* Font families */
  .font-sans-serif {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }

  .font-serif {
    font-family: Georgia, 'Times New Roman', serif;
  }

  /* Line spacing */
  .spacing-1 {
    line-height: 1;
  }

  .spacing-1-5 {
    line-height: 1.5;
  }

  .spacing-2 {
    line-height: 2;
  }

  .spacing-2-5 {
    line-height: 2.5;
  }

  /* Remove animations for users who prefer reduced motion */
  .reduced-motion *, .reduced-motion *::before, .reduced-motion *::after {
    animation-duration: 0.001s !important;
    transition-duration: 0.001s !important;
  }

  /* Focus styles */
  :focus {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }

  /* Focus styles for high contrast */
  .high-contrast :focus {
    outline: 3px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 3px;
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
    line-height: 1.2;
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.headings.h1.fontSize};
    font-weight: ${({ theme }) => theme.typography.headings.h1.fontWeight};
    line-height: ${({ theme }) => theme.typography.headings.h1.lineHeight};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.headings.h2.fontSize};
    font-weight: ${({ theme }) => theme.typography.headings.h2.fontWeight};
    line-height: ${({ theme }) => theme.typography.headings.h2.lineHeight};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.headings.h3.fontSize};
    font-weight: ${({ theme }) => theme.typography.headings.h3.fontWeight};
    line-height: ${({ theme }) => theme.typography.headings.h3.lineHeight};
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.headings.h4.fontSize};
    font-weight: ${({ theme }) => theme.typography.headings.h4.fontWeight};
    line-height: ${({ theme }) => theme.typography.headings.h4.lineHeight};
  }

  h5 {
    font-size: ${({ theme }) => theme.typography.headings.h5.fontSize};
    font-weight: ${({ theme }) => theme.typography.headings.h5.fontWeight};
    line-height: ${({ theme }) => theme.typography.headings.h5.lineHeight};
  }

  h6 {
    font-size: ${({ theme }) => theme.typography.headings.h6.fontSize};
    font-weight: ${({ theme }) => theme.typography.headings.h6.fontWeight};
    line-height: ${({ theme }) => theme.typography.headings.h6.lineHeight};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  /* Links */
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};
  }

  a:hover {
    text-decoration: underline;
  }

  /* High contrast links */
  .high-contrast a {
    text-decoration: underline;
  }

  /* Skip to content link - visible only on focus */
  .skip-to-content {
    position: absolute;
    top: -40px;
    left: 0;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.buttonText};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    z-index: ${({ theme }) => theme.zIndices.modal + 1};
    transition: top 0.3s;
  }

  .skip-to-content:focus {
    top: 0;
  }

  /* Code blocks */
  code, pre {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 0.9em;
    background-color: ${({ theme }) => theme.colors.inputBackground};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  code {
    padding: 0.2em 0.4em;
  }

  pre {
    padding: ${({ theme }) => theme.spacing.md};
    overflow-x: auto;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  pre code {
    padding: 0;
    background-color: transparent;
  }

  /* Lists */
  ul, ol {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    padding-left: ${({ theme }) => theme.spacing.xl};
  }

  li {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  th, td {
    padding: ${({ theme }) => theme.spacing.sm};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    text-align: left;
  }

  th {
    font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  }

  /* For high contrast mode, add borders around table cells */
  .high-contrast th, .high-contrast td {
    border: 1px solid ${({ theme }) => theme.colors.border};
  }

  /* Accessibility: Visually hide elements but keep them accessible to screen readers */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;

export default GlobalStyle; 