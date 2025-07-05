import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcn-ui/card';
import { Badge } from '@/components/shadcn-ui/badge';
import { Metadata } from 'next';

interface AboutProps {
  creator: string;
  email: string;
}

export const metadata: Metadata = {
  title: 'About | Next Event Scheduler',
  description:
    'Learn about the Next Event Scheduler app, its creator, and the technologies used to build it.',
  openGraph: {
    title: 'About | Next Event Scheduler',
    description:
      'Learn about the Next Event Scheduler app, its creator, and the technologies used to build it.',
    url: 'https://yourdomain.com/about',
    siteName: 'Next Event Scheduler',
    type: 'website',
  },
};

export default async function AboutPage() {
  const aboutData: AboutProps = {
    creator: 'Loc Nguyen Huu',
    email: 'nghloc1603@gmail.com',
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-muted">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>About This App</CardTitle>
        </CardHeader>
        <CardContent>
          <section className="mb-4">
            <h2 className="text-lg font-semibold">Overview</h2>
            <p>
              This web application is designed to showcase modern web
              development practices using popular open-source technologies. It’s
              fast, modular, and beautiful.
            </p>
          </section>
          <section className="mb-4">
            <h2 className="text-lg font-semibold">Creator</h2>
            <p className="mb-2">
              <span className="font-medium">{aboutData.creator}</span>
            </p>
          </section>
          <section className="mb-4">
            <h2 className="text-lg font-semibold">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Next.js</Badge>
              <Badge variant="outline">React 19</Badge>
              <Badge variant="outline">TypeScript</Badge>
              <Badge variant="outline">shadcn/ui</Badge>
              <Badge variant="outline">Tailwind CSS</Badge>
              <Badge variant="outline">Other Useful Tools</Badge>
            </div>
          </section>
          <section>
            <h2 className="text-lg font-semibold">Contact</h2>
            <p>
              For questions or feedback, contact:{' '}
              <a
                href={`mailto:${aboutData.email}`}
                className="text-primary underline hover:text-primary/80"
              >
                {aboutData.email}
              </a>
            </p>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
