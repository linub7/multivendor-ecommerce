'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store } from '@prisma/client';
import { v4 } from 'uuid';

import { StoreSchema } from '@/lib/form-validations';
import { AlertDialog } from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import ImageUploader from '@/components/shared/image-uploader';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { upsertStore } from '@/queries/store';

interface Props {
  data?: Store;
}

const SellerDashboardStoreDetailsForm = (props: Props) => {
  const { data } = props;

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof StoreSchema>>({
    mode: 'onChange',
    resolver: zodResolver(StoreSchema),
    defaultValues: {
      name: data?.name || '',
      description: data?.description || '',
      email: data?.email || '',
      phone: data?.email || '',
      logo: data?.logo ? [{ url: data?.logo }] : [],
      cover: data?.cover ? [{ url: data?.cover }] : [],
      url: data?.url || '',
      status: data?.status?.toString(),
      featured: data?.featured || false,
    },
  });

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        description: data?.description,
        email: data?.email,
        phone: data?.phone,
        logo: [{ url: data?.logo }],
        cover: [{ url: data?.cover }],
        url: data?.url,
        featured: data?.featured,
        status: data?.status,
      });
    }
  }, [data, form]);

  const isLoading = form.formState.isSubmitting;

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof StoreSchema>) => {
    try {
      const response = await upsertStore({
        id: data?.id ? data?.id : v4(),
        name: values.name,
        description: values.description,
        email: values.email,
        phone: values.phone,
        logo: values.logo[0].url,
        cover: values.cover[0].url,
        url: values.url,
        featured: values.featured,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      toast({
        title: data?.id
          ? 'store has been updated.'
          : `Congratulations! ${response?.name} is now created.`,
      });
      if (data?.id) router.refresh();
      else router.push(`/dashboard/seller/stores/${response.url}`);
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'OOPS!',
        description: error?.toString() || 'Something went wrong.',
      });
    }
  };
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} store information.`
              : ' Lets create a store. You can edit store later from the store settings page.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative py-2 mb-24">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="absolute -bottom-20 -left-48 z-10 inset-x-40">
                      <FormControl>
                        <ImageUploader
                          type="profile"
                          values={field.value.map((img) => img.url)}
                          // disabled={isLoading}
                          onChange={(url) => field.onChange([{ url }])}
                          onRemove={(url) =>
                            field.onChange(
                              ...field.value.filter((img) => img.url !== url)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cover"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUploader
                          type="cover"
                          values={field.value.map((img) => img.url)}
                          // disabled={isLoading}
                          onChange={(url) => field.onChange([{ url }])}
                          onRemove={(url) =>
                            field.onChange(
                              ...field.value.filter((img) => img.url !== url)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                // disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                // disabled={isLoading}
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-6 md:flex-row">
                <FormField
                  // disabled={isLoading}
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Store email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  // disabled={isLoading}
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Store phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                // disabled={isLoading}
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>store url</FormLabel>
                    <FormControl>
                      <Input placeholder="/store-url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This store will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? 'loading...'
                  : data?.id
                  ? 'Save store information'
                  : 'Create store'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default SellerDashboardStoreDetailsForm;
