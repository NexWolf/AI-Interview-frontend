export type ErrorProps = {
  message?: string;
};

export const InputError = ({ message }: ErrorProps) => {
  if (!message) return null;
  return (
    <p className="text-xs font-medium text-rose-500 mt-1 animate-in fade-in duration-150">
      {message}
    </p>
  );
};

export default InputError;
