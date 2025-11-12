import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { UseMutateFunction } from "react-query";
import { Link } from "react-router-dom";
import { Button } from "../../common/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../common/ui/form";
import { Input } from "../../common/ui/input";
import { Loader } from "../../common/ui/loader";
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "../../schema/auth";

type ForgotPasswordFormProps = {
  onSubmit: UseMutateFunction<unknown, AxiosError, { email: string }, unknown>;
  loading: boolean;
};

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  loading,
}) => {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (data: ForgotPasswordFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 w-full"
      >
        <div className="space-y-4 md:space-y-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        disabled={loading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={loading}
            type="submit"
            className={`w-full text-white bg-cyan-500 hover:bg-cyan-600 ${
              loading ? "cursor-not-allowed" : ""
            }`}
          >
            {loading && (
              <span className="mr-2">
                <Loader color="#ffffff" size={15} />
              </span>
            )}
            Submit
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-cyan-500 hover:underline dark:text-cyan-500"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};
