"use client";
import {
  FieldValues,
  FormProvider,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { Button } from "../ui/button";
import LoadingIcon from "@/component/shared/LoadingIcon";

type FormProps<T extends FieldValues> = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  onSubmit: (data: T) => void;
  FORM_DATA?: T;
  methods?: UseFormReturn<T>;
  button_title?: string,
  loading?: boolean,
  loading_title?: string,
  disabeld?: boolean,
};

export const FormTag = <T extends FieldValues>({
  children,
  title,
  description,
  FORM_DATA,
  onSubmit,
  methods: externalMethods,
  loading,
  button_title,
  loading_title,
  disabeld
}: FormProps<T>) => {
  const internalMethods = useForm<T>({
    defaultValues: FORM_DATA as any,
  });
  const methods = externalMethods ?? internalMethods;
  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-5 py-3">
          {title && <h1>{title}</h1>}
          {description && <p>{description}</p>}
        </div>

        <div>{children}</div>
        {button_title ? (
          <div className="w-full flex justify-end my-3">
            <Button type="submit" disabled={loading || disabeld}>
              {loading ? (
                <div>
                  <LoadingIcon />
                  <span>{loading_title}</span>
                </div>

              ) : (
                <span>{button_title}</span>
              )}

            </Button>
          </div>
        ) : (null)}
      </form>
    </FormProvider>
  );
};

export default FormTag;
