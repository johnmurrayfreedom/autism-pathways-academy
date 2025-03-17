import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  test('renders button with correct text', () => {
    render(<Button>Test Button</Button>);
    const buttonElement = screen.getByText('Test Button');
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    const buttonElement = screen.getByText('Click Me');
    fireEvent.click(buttonElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies variant styles correctly', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const buttonElement = screen.getByText('Primary Button');
    
    // Check that the button has the appropriate class or styling
    // This will depend on your implementation
    expect(buttonElement).toHaveClass('primary');
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const buttonElement = screen.getByText('Disabled Button');
    
    expect(buttonElement).toBeDisabled();
  });

  test('renders with correct accessibility attributes', () => {
    render(<Button aria-label="Accessible Button">Click</Button>);
    const buttonElement = screen.getByText('Click');
    
    expect(buttonElement).toHaveAttribute('aria-label', 'Accessible Button');
  });
}); 