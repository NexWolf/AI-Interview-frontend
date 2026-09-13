"use client"
import { Controller, FieldPath, FieldValues, get, useFormContext } from "react-hook-form";
import PhoneInput from "react-phone-number-input";

type PhoneProps<T extends FieldValues> = {
  name :FieldPath<T>
}

const PhoneNumber = <T extends FieldValues>({
  name 
} : PhoneProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const phoneError = get(errors, name)
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Phone Number</label>

        <Controller
          name= {name}
          control={control}
          rules={{ required: "Phone number is required" }}
          render={({ field: { onChange, value } }) => (
            <PhoneInput
              international
              defaultCountry="PS"
              value={value}
              onChange={onChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-ring"
            />
          )}
        />
        {phoneError && (
          <p className="text-red-500 text-xs mt-1">
            {String(phoneError.message)}
          </p>
        )}
      </div>
    </div>
  );
};

export default PhoneNumber;
