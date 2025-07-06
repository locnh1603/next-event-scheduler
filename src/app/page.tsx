import { Metadata } from 'next';
import { env } from '@env';

export const metadata: Metadata = {
  title: 'Next Event Scheduler | Home',
  description:
    'Plan, discover, and manage events with Next Event Scheduler. Modern, fast, and open-source event platform.',
  openGraph: {
    title: 'Next Event Scheduler',
    description:
      'Plan, discover, and manage events with Next Event Scheduler. Modern, fast, and open-source event platform.',
    url: env.APP_URL,
    siteName: 'Next Event Scheduler',
    type: 'website',
  },
};

const Home = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to Next Event Scheduler
      </h1>
      <p className="text-lg text-gray-600 max-w-xl text-center">
        Plan, discover, and manage events with a modern, fast, and open-source
        event platform built with Next.js and Supabase.
      </p>
    </main>
  );
};

export default Home;
