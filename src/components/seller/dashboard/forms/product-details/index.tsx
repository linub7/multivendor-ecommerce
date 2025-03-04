'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category } from '@prisma/client';
import { v4 } from 'uuid';

import { ProductSchema } from '@/lib/form-validations';
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
import { ProductWithVariant } from '@/lib/types';
import ImagesPreviewGrid from '@/components/shared/images-preview-grid';
import ClickToAddComponent from '@/components/shared/click-to-add';
import ProductDetailsFormErrorMessageComponent from './error-message';

interface Props {
  data?: ProductWithVariant;
  categories: Category[];
  storeUrl: string;
}

const SellerDashboardProductDetailsForm = (props: Props) => {
  const { data } = props;

  const { toast } = useToast();
  const router = useRouter();

  // temp state for images
  const [tmpImages, setTmpImages] = useState<{ url: string }[]>([]);
  const [imgColors, setImgColors] = useState<{ color: string }[]>(
    data?.productVariantColors || [{ color: '' }]
  );
  const [productSizes, setProductSizes] = useState<
    {
      size: string;
      quantity: number;
      price: number;
      discount: number;
    }[]
  >(
    data?.productVariantSizes || [
      { size: '', quantity: 1, price: 0.01, discount: 0 },
    ]
  );

  const form = useForm<z.infer<typeof ProductSchema>>({
    mode: 'onChange',
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: data?.name || '',
      description: data?.description || '',
      brand: data?.brand || '',
      productVariantImages: data?.productVariantImages || [],
      categoryId: data?.categoryId || '',
      subCategoryId: data?.subCategoryId || '',
      isSale: data?.isSale || false,
      keywords: data?.keywords || [],
      productVariantColors: data?.productVariantColors || [{ color: '' }],
      productVariantSizes: data?.productVariantSizes || [],
      sku: data?.sku || '',
      variantDescription: data?.variantDescription || '',
      variantName: data?.variantName || '',
    },
  });

  // Extracted Form errors
  const formErrors = form.formState.errors;

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        description: data?.description,
        sku: data?.sku,
        brand: data?.brand,
        productVariantImages: data?.productVariantImages,
        categoryId: data?.categoryId,
        subCategoryId: data?.subCategoryId,
        keywords: data?.keywords || [],
        isSale: data?.isSale,
        productVariantColors: data?.productVariantColors,
        productVariantSizes: data?.productVariantSizes,
        variantDescription: data?.variantDescription,
        variantName: data?.variantName,
      });
    }
  }, [data, form]);

  // Whenever colors, size, keywords changes, we have to update the form values
  useEffect(() => {
    form.setValue('productVariantColors', imgColors);
    form.setValue('productVariantSizes', productSizes);

    return () => {};
  }, [form, imgColors, productSizes]);

  console.log('form sizes', form.watch().productVariantSizes);

  const isLoading = form.formState.isSubmitting;

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof ProductSchema>) => {
    try {
      //   const response = await upsertStore({
      //     id: data?.id ? data?.id : v4(),
      //     name: values.name,
      //     description: values.description,
      //     email: values.email,
      //     phone: values.phone,
      //     logo: values.logo[0].url,
      //     cover: values.cover[0].url,
      //     url: values.url,
      //     featured: values.featured,
      //     createdAt: new Date(),
      //     updatedAt: new Date(),
      //   });
      //   toast({
      //     title: data?.id
      //       ? 'store has been updated.'
      //       : `Congratulations! ${response?.name} is now created.`,
      //   });
      //   if (data?.id) router.refresh();
      //   else router.push(`/dashboard/seller/stores/${response.url}`);
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
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            {data?.productId && data?.variantId
              ? `Update ${data?.name} product information.`
              : ' Lets create a product. You can edit product later from the product page.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* <div className="relative py-2 mb-24"> */}
              <div className="flex flex-col gap-y-4 xl:flex-row">
                {/* Images */}
                <FormField
                  control={form.control}
                  name="productVariantImages"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div>
                          <ImagesPreviewGrid
                            images={form.getValues().productVariantImages}
                            imgColors={imgColors}
                            setImgColors={setImgColors}
                            onRemove={(url) => {
                              const updatedImages = tmpImages.filter(
                                (item) => item.url !== url
                              );
                              setTmpImages(updatedImages);
                              field.onChange(updatedImages);
                            }}
                          />
                          <FormMessage className="!mt-4" />
                          <ImageUploader
                            type="standard"
                            values={field.value.map((img) => img.url)}
                            // disabled={isLoading}
                            onChange={(url) => {
                              setTmpImages((prevImages) => {
                                const updatedImages = [...prevImages, { url }];
                                field.onChange(updatedImages);
                                return updatedImages;
                              });
                            }}
                            onRemove={(url) =>
                              field.onChange(
                                ...field.value.filter((img) => img.url !== url)
                              )
                            }
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* Colors */}
                <div className="w-full flex flex-col gap-y-3 xl:pl-5">
                  <ClickToAddComponent
                    details={imgColors}
                    header="Colors"
                    initialDetail={{ color: '' }}
                    setDetails={setImgColors}
                  />
                  {formErrors.productVariantColors && (
                    <ProductDetailsFormErrorMessageComponent
                      errorMessage={formErrors.productVariantColors.message}
                    />
                  )}
                </div>
              </div>
              {/* </div> */}
              <FormField
                // disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Product name</FormLabel>
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
                    <FormLabel>Product description</FormLabel>
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
                  name="brand"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Brand" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  // disabled={isLoading}
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Sku</FormLabel>
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
                name="variantName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Variant Name</FormLabel>
                    <FormControl>
                      <Input placeholder="variant name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                // disabled={isLoading}
                control={form.control}
                name="variantDescription"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Variant Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="variant description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isSale"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Is Sale</FormLabel>
                      <FormDescription>
                        This Product will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              {/* Colors */}
              <div className="w-full flex flex-col gap-y-3 xl:pl-5">
                <ClickToAddComponent
                  details={productSizes}
                  header="Sizes, Prices, Quantities, Discounts"
                  initialDetail={{
                    size: '',
                    price: 0.01,
                    quantity: 1,
                    discount: 0,
                  }}
                  setDetails={setProductSizes}
                />
                {formErrors.productVariantSizes && (
                  <ProductDetailsFormErrorMessageComponent
                    errorMessage={formErrors.productVariantSizes.message}
                  />
                )}
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? 'loading...'
                  : data?.productId && data?.variantId
                  ? 'Save product information'
                  : 'Create product'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default SellerDashboardProductDetailsForm;
