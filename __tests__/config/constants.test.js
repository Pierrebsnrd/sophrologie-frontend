import {
  SOCIAL_LINKS,
  EXTERNAL_SERVICES,
  NAV_LINKS,
  CONTACT_INFO,
  APP_CONFIG,
  API_CONFIG
} from '../../config/constants';

describe('Constants Configuration', () => {
  describe('SOCIAL_LINKS', () => {
    it('should have valid social media URLs', () => {
      expect(SOCIAL_LINKS.FACEBOOK).toMatch(/^https:\/\/www\.facebook\.com/);
      expect(SOCIAL_LINKS.INSTAGRAM).toMatch(/^https:\/\/www\.instagram\.com/);
    });

    it('should have all required social links', () => {
      expect(SOCIAL_LINKS).toHaveProperty('FACEBOOK');
      expect(SOCIAL_LINKS).toHaveProperty('INSTAGRAM');
    });
  });

  describe('EXTERNAL_SERVICES', () => {
    it('should have valid Resalib URLs', () => {
      expect(EXTERNAL_SERVICES.RESALIB_BOOKING).toMatch(/^https:\/\/www\.resalib\.fr/);
      expect(EXTERNAL_SERVICES.RESALIB_ADMIN).toMatch(/^https:\/\/www\.resalib\.fr/);
    });
  });

  describe('NAV_LINKS', () => {
    it('should have correct navigation structure', () => {
      expect(Array.isArray(NAV_LINKS)).toBe(true);
      expect(NAV_LINKS.length).toBeGreaterThan(0);

      NAV_LINKS.forEach(link => {
        expect(link).toHaveProperty('href');
        expect(link).toHaveProperty('label');
        expect(typeof link.href).toBe('string');
        expect(typeof link.label).toBe('string');
        expect(link.href).toMatch(/^\/[a-z-]*$/);
      });
    });

    it('should include all expected navigation items', () => {
      const labels = NAV_LINKS.map(link => link.label);
      expect(labels).toContain('Accueil');
      expect(labels).toContain('Qui suis-je ?');
      expect(labels).toContain('Tarifs');
      expect(labels).toContain('Prendre rendez-vous');
      expect(labels).toContain('Témoignages');
      expect(labels).toContain('Contact');
      expect(labels).toContain('Charte éthique');
    });
  });

  describe('CONTACT_INFO', () => {
    it('should have valid contact information', () => {
      expect(CONTACT_INFO.EMAIL).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(CONTACT_INFO.PHONE).toMatch(/^[0-9\s]+$/);
    });

    it('should have complete address information', () => {
      expect(CONTACT_INFO.ADDRESS).toHaveProperty('STREET');
      expect(CONTACT_INFO.ADDRESS).toHaveProperty('CITY');
      expect(CONTACT_INFO.ADDRESS).toHaveProperty('POSTAL_CODE');

      expect(CONTACT_INFO.ADDRESS.POSTAL_CODE).toMatch(/^[0-9]{5}$/);
      expect(CONTACT_INFO.ADDRESS.CITY).toBe('Saint-Germain-en-Laye');
    });
  });

  describe('APP_CONFIG', () => {
    it('should have session storage keys', () => {
      expect(APP_CONFIG.SESSION_STORAGE_KEYS).toHaveProperty('PLAY_MUSIC');
      expect(APP_CONFIG.SESSION_STORAGE_KEYS.PLAY_MUSIC).toBe('playMusic');
    });

    it('should have schedule information', () => {
      expect(APP_CONFIG.SCHEDULE).toHaveProperty('TUESDAY');
      expect(APP_CONFIG.SCHEDULE).toHaveProperty('FRIDAY');
      expect(APP_CONFIG.SCHEDULE.TUESDAY).toContain('cabinet');
      expect(APP_CONFIG.SCHEDULE.FRIDAY).toContain('visioconsultation');
    });
  });

  describe('API_CONFIG', () => {
    it('should have base URL configuration', () => {
      expect(API_CONFIG).toHaveProperty('BASE_URL');
      expect(typeof API_CONFIG.BASE_URL).toBe('string');
    });

    it('should have correct API endpoints', () => {
      expect(API_CONFIG.ENDPOINTS).toHaveProperty('CONTACT');
      expect(API_CONFIG.ENDPOINTS).toHaveProperty('TESTIMONIALS');
      expect(API_CONFIG.ENDPOINTS).toHaveProperty('ADMIN');

      // Check that endpoints match actual backend routes (no /api prefix)
      expect(API_CONFIG.ENDPOINTS.CONTACT).toBe('/contact');
      expect(API_CONFIG.ENDPOINTS.TESTIMONIALS).toBe('/temoignage');
      expect(API_CONFIG.ENDPOINTS.ADMIN).toBe('/admin');
    });
  });
});