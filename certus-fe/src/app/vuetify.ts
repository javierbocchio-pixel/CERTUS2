import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

export const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1E3A8A',
          secondary: '#2563EB',
          accent: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#0EA5E9',
          success: '#10B981',
          surface: '#FFFFFF'
        }
      }
    }
  }
});
