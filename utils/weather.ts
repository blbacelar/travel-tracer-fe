import { FeatherIconName } from '../types/api';

export const getWeatherIcon = (condition: string): FeatherIconName => {
  const normalizedCondition = condition.toLowerCase();

  switch (normalizedCondition) {
    case 'clear':
      return 'sun';
    case 'partly cloudy':
      return 'cloud';
    case 'cloudy':
      return 'cloud';
    case 'rain':
      return 'cloud-rain';
    case 'snow':
      return 'cloud-snow';
    default:
      return 'sun'; // Default icon for unknown conditions
  }
}; 