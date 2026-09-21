import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormTag from "./FormTag";
import { FieldValues, UseFormReturn } from "react-hook-form";



type DialogProps<T extends FieldValues> = {
    onOpen : boolean,
    onClose : () => void,
    title : string,
    description : string,
    onSubmit : (data : T) => void,
    children : React.ReactNode,
    methods : UseFormReturn<T>,
    form_button_title : string,
    loading ?: boolean,
    loading_title ?: string
}

export const FormDialog = <T extends FieldValues>({
    onOpen ,
    onClose,
    title,
    description,
    onSubmit,
    children,
    methods,
    form_button_title,
    loading,
    loading_title
} : DialogProps<T>) => {

    
    return (
        <Dialog open={onOpen} onOpenChange={onClose}>

      {/* 2. محتوى الـ Popup */}
<DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border-border/60 bg-card p-6 shadow-lg">        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-xl font-bold text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* 3. النموذج المدمج داخلياً */}
        <div className="pt-2">
          <FormTag
          loading = {loading}
            onSubmit={onSubmit}
            methods={methods}
            button_title = {form_button_title}
            loading_title= {loading_title}
          >
            {children}
          </FormTag>
        </div>
      </DialogContent>
    </Dialog>
    )
}

export default FormDialog;