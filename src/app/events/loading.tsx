import {Spinner} from '@/components/spinner';

const Loading = () => {
  return (
    <div className="h-full w-full flex items-center">
      <Spinner size="large" />
    </div>
  )
}
export default Loading;
