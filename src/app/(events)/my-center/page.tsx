import CenterControl from './center-control';
import CenterDataDisplay from './center-data-display';

const MyCenter = () => {
  return (
    <div className="h-full">
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-4xl font-bold mb-2">My Event Center</h1>
        <p className="text-gray-600">Discover and manage your events</p>
        <CenterControl />
        <CenterDataDisplay />
      </div>
    </div>
  );
};

export default MyCenter;
