import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Home from '../components/landing/Home';
import { describe, it, expect, vi } from 'vitest';

// Mock scroll window
window.scrollTo = vi.fn();

const theme = createTheme();

describe('Home Component', () => {
    it('renders the main heading', () => {
        render(
            <MemoryRouter>
                <ThemeProvider theme={theme}>
                    <Home />
                </ThemeProvider>
            </MemoryRouter>
        );

        // Using a more flexible matcher since the text is split or styled
        expect(screen.getByText(/Your City/i)).toBeInTheDocument();
        expect(screen.getByText(/One App/i)).toBeInTheDocument();
    });

    it('renders "Get Started" button', () => {
        render(
            <MemoryRouter>
                <ThemeProvider theme={theme}>
                    <Home />
                </ThemeProvider>
            </MemoryRouter>
        );

        const getStartedButton = screen.getByRole('link', { name: /Explore Now/i });
        expect(getStartedButton).toBeInTheDocument();
    });
});
