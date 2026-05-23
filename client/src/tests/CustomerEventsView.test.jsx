import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CustomerEventsView from '../components/customer/CustomerEventsView';
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

describe('CustomerEventsView Component', () => {
    it('renders the directory heading and description', () => {
        render(
            <MemoryRouter>
                <ThemeProvider theme={theme}>
                    <CustomerEventsView />
                </ThemeProvider>
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: /Community Events\./i })).toBeInTheDocument();
    });

    it('displays the search bar placeholder', () => {
        render(
            <MemoryRouter>
                <ThemeProvider theme={theme}>
                    <CustomerEventsView />
                </ThemeProvider>
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText(/Search by event, description, organizer/i)).toBeInTheDocument();
    });
});
