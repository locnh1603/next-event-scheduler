import { Spinner } from '@/components/shadcn-ui/spinner';

const Loading = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Spinner size="large" />
    </div>
  );
};
export default Loading;
