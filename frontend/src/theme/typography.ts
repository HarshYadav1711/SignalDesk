import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.15,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  captionMedium: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  badge: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
};
