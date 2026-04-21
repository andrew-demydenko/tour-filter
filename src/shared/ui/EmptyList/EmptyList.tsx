export const EmptyList = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <p className="text-gray-600 text-center text-lg">{message}</p>
    </div>
  );
};
