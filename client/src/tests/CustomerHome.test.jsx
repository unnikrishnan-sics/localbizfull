import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CustomerHome from '../components/customer/CustomerHome';
import { describe, it, expect, vi } from 'vitest';

// Mock scroll and axios
window.scrollTo = vi.fn();
vi.mock('axios', () => ({
    default: {
        get: vi.fn(() => Promise.resolve({ data: [] })),
        post: vi.fn(() => Promise.resolve({ data: {} })),
        create: vi.fn().mockReturnThis(),
        interceptors: {
            request: { use: vi.fn(), eject: vi.fn() },
            response: { use: vi.fn(), eject: vi.fn() },
        }
    },
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
}));

const theme = createTheme();

describe('CustomerHome Component', () => {
    it('renders the hero section with expected text', () => {
        render(
            <MemoryRouter>
                <ThemeProvider theme={theme}>
                    <CustomerHome />
                </ThemeProvider>
            </MemoryRouter>
        );

        expect(screen.getByText(/Discovery Portal/i)).toBeInTheDocument();
        expect(screen.getByText(/Explore the best local businesses/i)).toBeInTheDocument();
    });

    it('displays search field', () => {
        render(
            <MemoryRouter>
                <ThemeProvider theme={theme}>
                    <CustomerHome />
                </ThemeProvider>
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText(/Find what you need/i)).toBeInTheDocument();
    });
});
