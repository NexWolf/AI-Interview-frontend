"use client"
import { FieldValues, FormProvider, useForm } from "react-hook-form";

type FormProps<T extends FieldValues> = {
    children : React.ReactNode;
    title ?: string,
    description ?: string; 
    onSubmit : ( data : T ) => void;
    FORM_DATA ?: T
}

export const FormTag = <T extends FieldValues>({children , title , description, FORM_DATA ,  onSubmit} : FormProps<T>) => {

      const methods = useForm<T>({
        defaultValues : FORM_DATA as any
      });

      const {handleSubmit} = methods;
    
    return (
        <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-5 py-3">
                {title && <h1>{title}</h1>}
                {description && <p>{description}</p>}
            </div>

            <div>{children}</div>
        </form>
        </FormProvider>
    )
}

export default FormTag;