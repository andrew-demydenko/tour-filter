interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <p className="text-red-600 text-center max-w-md">{message}</p>
    </div>
  );
};
