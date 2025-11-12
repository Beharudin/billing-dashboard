import { zodResolver } from "@hookform/resolvers/zod";

import { Edit } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../../common/ui/button";
import { Card, CardContent } from "../../../../common/ui/card";
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
  ProfileFormSchema,
  ProfileFormValues,
} from "../../../../schema/admin/profile";

export default function UserDetails({
  defaultValues,
  userLoading = true,
}: {
  defaultValues: any;
  userLoading: boolean;
}) {
  // const { handleEditProfile, isEditProfileLoading } = useSettings();
  const [isEditable, setIsEditable] = useState(false);

  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues,
  });

  const onSubmit = async (_data: ProfileFormValues) => {
    try {
      // await handleEditProfile(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditable(false);
    }
  };

  if (userLoading || defaultValues == null) {
    return (
      <Card className="p-5">
        <CardContent className="flex items-center justify-center py-12">
          <Loader color="#602699" size={40} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-full mx-auto mt-8">
      <div className="rounded-xl border border-gray-200 bg-white shadow-lg dark:bg-gray-900 dark:border-gray-800 p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            User Details
          </h3>
          {!isEditable && (
            <Button variant="ghost" onClick={() => setIsEditable(true)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="fullName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditable} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditable} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditable} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {isEditable && (
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditable(false)}
                  // disabled={isEditProfileLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-600"
                  // disabled={isEditProfileLoading}
                >
                  {/* {isEditProfileLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )} */}
                  Save
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
