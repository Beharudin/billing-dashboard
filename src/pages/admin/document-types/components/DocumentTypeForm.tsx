import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "../../../../common/ui/button";
import { Checkbox } from "../../../../common/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../common/ui/form";
import { Input } from "../../../../common/ui/input";
import { Loader } from "../../../../common/ui/loader";
import {
  documentTypeFormSchema,
  DocumentTypeFormValues,
} from "../../../../schema/admin/document-type";
import { UserDocumentsType } from "../../../../common/data/data";

interface DocumentTypeFormProps {
  defaultValues: Partial<DocumentTypeFormValues>;
  onSubmit: (data: DocumentTypeFormValues) => void;
  loading: boolean;
  onClose: () => void;
  buttonTitle: string;
}

const DocumentTypeForm: React.FC<DocumentTypeFormProps> = ({
  defaultValues,
  onSubmit,
  loading,
  onClose,
  buttonTitle,
}) => {
  const form = useForm<DocumentTypeFormValues>({
    resolver: zodResolver(documentTypeFormSchema),
    defaultValues,
  });

  const handleSubmit = async (data: DocumentTypeFormValues) => {
    onSubmit(data);
    onClose();
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 w-full"
      >
        <div className="grid gap-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Type Name:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={loading}
                    placeholder="Enter document type name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="isActive"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Active Status</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Enable this document type for use
                  </p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="userTypes"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Types:</FormLabel>
                <div className="space-y-3">
                  {UserDocumentsType.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.value}
                        checked={field.value?.includes(option.value) || false}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          if (checked) {
                            field.onChange([...currentValues, option.value]);
                          } else {
                            field.onChange(
                              currentValues.filter((value) => value !== option.value)
                            );
                          }
                        }}
                        disabled={loading}
                      />
                      <label
                        htmlFor={option.value}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                
                {/* Display selected user types */}
                {field.value && field.value.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Selected User Types:</p>
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((userType) => {
                        const option = UserDocumentsType.find(opt => opt.value === userType);
                        return (
                          <div
                            key={userType}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                          >
                            <span>{option?.label || userType}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const currentValues = field.value || [];
                                field.onChange(
                                  currentValues.filter((value) => value !== userType)
                                );
                              }}
                              className="hover:bg-blue-200 rounded-full p-0.5"
                              disabled={loading}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-center space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader color="#ffffff" size={15} />}
            {buttonTitle}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DocumentTypeForm;
