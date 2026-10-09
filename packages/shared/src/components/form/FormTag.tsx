"use client";

import React from "react";
import {
  FieldValues,
  FormProvider,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { Button } from "../ui/button";
import { LoadingIcon } from "../ui/LoadingIcon";
import { cn } from "../../lib/utils";

export type FormProps<T extends FieldValues> = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  onSubmit: (data: T) => void;
  FORM_DATA?: T;
  methods?: UseFormReturn<T>;
  button_title?: string;
  loading?: boolean;
  loading_title?: string;
  disabeld?: boolean;
  className?: string;
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
  loading_title = "Please wait...",
  disabeld,
  className,
}: FormProps<T>) => {
  const internalMethods = useForm<T>({
    defaultValues: FORM_DATA as any,
  });
  const methods = externalMethods ?? internalMethods;
  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        {(title || description) && (
          <div className="mb-4">
            {title && <h2 className="text-xl font-bold text-foreground">{title}</h2>}
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
        )}

        <div>{children}</div>

        {button_title && (
          <div className="w-full mt-6">
            <Button
              type="submit"
              disabled={loading || disabeld}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer shadow-md shadow-primary/20",
                "bg-primary hover:bg-primary/90 text-primary-foreground active:scale-[0.99]",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <LoadingIcon />
                  <span>{loading_title}</span>
                </div>
              ) : (
                <span>{button_title}</span>
              )}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default FormTag;
