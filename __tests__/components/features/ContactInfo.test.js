import { render, screen } from '@testing-library/react';
import ContactInfo from '../../../components/features/ContactInfo';

describe('ContactInfo Component', () => {
  it('renders contact information correctly', () => {
    render(<ContactInfo />);

    // Check main title
    expect(screen.getByText('Coordonnées')).toBeInTheDocument();

    // Check cabinet name
    expect(screen.getByText('Stéphanie Habert Sophrologue')).toBeInTheDocument();

    // Check address
    expect(screen.getByText(/38 ter, rue des Ursulines/)).toBeInTheDocument();
    expect(screen.getByText(/78100 Saint-Germain-en-Laye/)).toBeInTheDocument();

    // Check schedule
    expect(screen.getByText('Horaires d\'ouverture')).toBeInTheDocument();
    expect(screen.getByText(/Mardi : 9h30 - 17h30 au cabinet/)).toBeInTheDocument();
    expect(screen.getByText(/Vendredi : 9h30 - 17h30 en visioconsultation/)).toBeInTheDocument();

    // Check contact details
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('06 11 42 17 65')).toBeInTheDocument();
    expect(screen.getByText('stephaniehabert.sophrologue@gmail.com')).toBeInTheDocument();
  });

  it('renders clickable phone number', () => {
    render(<ContactInfo />);

    const phoneLink = screen.getByRole('link', { name: '06 11 42 17 65' });
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink).toHaveAttribute('href', 'tel:0611421765');
  });

  it('renders clickable email address', () => {
    render(<ContactInfo />);

    const emailLink = screen.getByRole('link', { name: 'stephaniehabert.sophrologue@gmail.com' });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:stephaniehabert.sophrologue@gmail.com');
  });

  it('renders social media links', () => {
    render(<ContactInfo />);

    expect(screen.getByText('Réseaux sociaux')).toBeInTheDocument();

    const facebookLink = screen.getByLabelText('Facebook');
    const instagramLink = screen.getByLabelText('Instagram');

    expect(facebookLink).toBeInTheDocument();
    expect(instagramLink).toBeInTheDocument();

    // Check external link attributes
    expect(facebookLink).toHaveAttribute('target', '_blank');
    expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(instagramLink).toHaveAttribute('target', '_blank');
    expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has proper semantic structure', () => {
    render(<ContactInfo />);

    // Check section element exists
    const section = document.querySelector('section');
    expect(section).toBeInTheDocument();

    // Check headings hierarchy
    expect(screen.getByRole('heading', { level: 2, name: 'Coordonnées' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Horaires d\'ouverture' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Contact' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Réseaux sociaux' })).toBeInTheDocument();
  });
});