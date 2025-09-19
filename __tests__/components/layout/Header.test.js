import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import Header from '../../../components/layout/Header';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock analytics
jest.mock('../../../utils/analytics', () => ({
  trackEvents: {
    clickRdv: jest.fn(),
    clickSocial: jest.fn(),
  },
}));

// Mock sessionStorage
const mockSessionStorage = {
  setItem: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

describe('Header Component', () => {
  const mockRouter = {
    pathname: '/',
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  it('renders header with logo and navigation', () => {
    render(<Header />);

    // Check logo
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();

    // Check navigation links
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('Qui suis-je ?')).toBeInTheDocument();
    expect(screen.getByText('Tarifs')).toBeInTheDocument();
    expect(screen.getByText('Prendre rendez-vous')).toBeInTheDocument();
    expect(screen.getByText('Témoignages')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Charte éthique')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Header />);

    const facebookLink = screen.getAllByLabelText('Facebook')[0];
    const instagramLink = screen.getAllByLabelText('Instagram')[0];

    expect(facebookLink).toBeInTheDocument();
    expect(instagramLink).toBeInTheDocument();
  });

  it('highlights active navigation link', () => {
    mockRouter.pathname = '/contact';
    render(<Header />);

    const contactLink = screen.getByRole('link', { name: 'Contact' });
    expect(contactLink).toHaveClass('active');
  });

  it('toggles mobile menu when hamburger is clicked', () => {
    render(<Header />);

    const hamburgerButton = screen.getByLabelText('Menu');

    // Click hamburger to open menu
    fireEvent.click(hamburgerButton);

    // Mobile navigation should be visible
    const mobileNav = document.querySelector('.mobileNav');
    expect(mobileNav).toBeInTheDocument();
  });

  it('sets session storage when "Qui suis-je" is clicked', () => {
    render(<Header />);

    const quiSuisJeLink = screen.getByRole('link', { name: 'Qui suis-je ?' });
    fireEvent.click(quiSuisJeLink);

    expect(mockSessionStorage.setItem).toHaveBeenCalledWith('playMusic', 'true');
  });

  it('has proper accessibility attributes', () => {
    render(<Header />);

    const hamburgerButton = screen.getByLabelText('Menu');
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');

    // Open menu
    fireEvent.click(hamburgerButton);
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');
  });
});