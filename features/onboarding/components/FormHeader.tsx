

type PropsHeaders = {
  leftStep: string;
  title: string;
  description: string;
};


const FormHeader = ({ leftStep, title, description }: PropsHeaders) => {
  return (
    <div className="mb-6 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-6 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
            {leftStep} step left 
          </span>
          <h2 className="text-xl font-bold text-gray-900">
            {title}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
           {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
