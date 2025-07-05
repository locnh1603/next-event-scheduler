import { Metadata } from 'next';
import { env } from '@env';
import MaterialCalculator from './material-calc';

export const metadata: Metadata = {
  title: 'Tools | Next Event Scheduler',
  description: 'Useful tools and utilities for myself.',
  openGraph: {
    title: 'Tools | Next Event Scheduler',
    description: 'Useful tools and utilities for myself.',
    url: `${env.APP_URL}/tools`,
    siteName: 'Next Event Scheduler',
    type: 'website',
  },
};

const Tools = async () => {
  return <MaterialCalculator />;
};

export default Tools;
