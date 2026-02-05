import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import AdminDashboard from '../components/admin/AdminDashboard';
import { describe, it, expect, vi } from 'vitest';

// Mock scroll, axios, and recharts
window.scrollTo = vi.fn();
vi.mock('axios', () => ({
    default: {
        get: vi.fn(() => Promise.resolve({ data: { stats: { users: 10, businesses: 5, organisations: 3 } } })),
        post: vi.fn(() => Promise.resolve({ data: {} })),
        create: vi.fn().mockReturnThis(),
        interceptors: {
            request: { use: vi.fn(), eject: vi.fn() },
            response: { use: vi.fn(), eject: vi.fn() },
        }
    },
    get: vi.fn(() => Promise.resolve({ data: { stats: { users: 10, businesses: 5, organisations: 3 } } })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
}));

vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    AreaChart: () => <div data-testid="area-chart">Area Chart</div>,
    Area: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
}));

const theme = createTheme();

describe('AdminDashboard Component', () => {
    it('renders the command center title', () => {
        render(
            <MemoryRouter>
                <ThemeProvider theme={theme}>
                    <AdminDashboard />
                </ThemeProvider>
            </MemoryRouter>
        );

        expect(screen.getByText(/Command Center/i)).toBeInTheDocument();
    });

    it('renders metric cards', async () => {
        render(
            <MemoryRouter>
                <ThemeProvider theme={theme}>
                    <AdminDashboard />
                </ThemeProvider>
            </MemoryRouter>
        );

        expect(await screen.findByText(/Total Users/i)).toBeInTheDocument();
        expect(await screen.findByText(/Businesses/i)).toBeInTheDocument();
        expect(await screen.findByText(/Organisations/i)).toBeInTheDocument();
    });
});
