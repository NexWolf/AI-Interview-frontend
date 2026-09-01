type ErrorProps = {
  message: string;
};

const InputError = ({ message }: ErrorProps) => {
  return (
    <p className="text-xs font-medium text-red-400">{message}</p>
  );
};

export default InputError;
