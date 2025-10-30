"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { type SizeProduct, type createData } from "./edit-product";
import axios from "axios";
import ImageUpload from "@/components/admin/image-upload";

type EditFormProps = {
  data: createData;
  onSubmit: (formData: any) => void;
};

type Category = {
  id: string;
  name: string;
  billboard: string;
  category: string;
};

type InitialType = {
  title: string;
  description: string;
  price: number;
  category: string;
  imageURLs: string[];
  isFeatured: boolean;
  productSizes?: SizeProduct[];
  categoryId: string;
  discount?: number;
};

const EditForm = ({ data, onSubmit }: EditFormProps) => {
  const {
    title,
    description,
    imageURLs,
    category,
    price,
    featured,
    productSizes,
    categoryId,
    discount,
  } = data;

  // Parse imageURLs if it's a JSON string
  const parsedImageURLs = typeof imageURLs === 'string' 
    ? JSON.parse(imageURLs) 
    : imageURLs;

  const initialState = {
    title,
    description,
    price,
    category,
    imageURLs: parsedImageURLs || [],
    isFeatured: featured,
    productSizes: productSizes,
    categoryId,
    discount,
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkbox, setCheckBox] = useState<boolean>(featured);
  const [dataForm, setDataForm] = useState<InitialType>(initialState);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleCheckboxChange = () => {
    setCheckBox((prevCheck) => !prevCheck);
  };

  useEffect(() => {
    setCheckBox(featured);
  }, [featured]);

  useEffect(() => {
    setDataForm({
      title,
      description,
      price,
      category,
      imageURLs: parsedImageURLs || [],
      isFeatured: featured,
      productSizes,
      categoryId,
      discount,
    });
  }, [
    featured,
    title,
    description,
    price,
    category,
    parsedImageURLs,
    productSizes,
    categoryId,
    discount,
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resCategory = await axios.get("/api/categories");
        const data = resCategory.data;
        setCategories(data);
      } catch (error) {
        console.log("Error getting categories", error);
      }
    };

    fetchCategories();
  }, []);
  const [categorySizes, setCategorySizes] = useState([]);

  useEffect(() => {
    const fetchCategorySizes = async () => {
      try {
        const response = await axios.get(`/api/sizes/${dataForm.categoryId}`);
        setCategorySizes(response.data);
      } catch (error) {
        console.error("Error fetching sizes for category:", error);
      }
    };

    if (dataForm.categoryId) {
      fetchCategorySizes();
    }
  }, [dataForm.categoryId]);

  const handleImageUrlsChange = (urls: string[]) => {
    setDataForm((prevData) => ({ ...prevData, imageURLs: urls }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const submitData = {
      title: dataForm.title,
      description: dataForm.description,
      price: dataForm.price,
      category: dataForm.category,
      featured: checkbox,
      imageURLs: dataForm.imageURLs,
      discount: dataForm.discount,
      sizes: dataForm.productSizes,
      categoryId: dataForm.categoryId,
    };
    
    await onSubmit(submitData);
    setIsLoading(false);
  };

  const handleSizeClick = (sizeId: string, sizeName: string) => {
    setDataForm((prevData: any) => {
      const updatedProductSizes: { sizeId: string; name: string }[] =
        prevData.productSizes || [];
      const newSize = { sizeId, name: sizeName };
      if (!updatedProductSizes.some((size) => size.sizeId === newSize.sizeId)) {
        updatedProductSizes.push(newSize);
      }

      return { ...prevData, productSizes: updatedProductSizes };
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-y-2 max-md:min-w-[90%] min-w-[70%] border p-4"
    >
      <label htmlFor="name">Enter Product Name</label>
      <Input
        value={dataForm.title}
        type="text"
        id="name"
        name="name"
        required
        placeholder="Enter Product name"
        onChange={(e) => setDataForm({ ...dataForm, title: e.target.value })}
      />
      <label htmlFor="price">Enter Product Price</label>
      <Input
        value={dataForm.price}
        type="number"
        id="price"
        min={1}
        name="price"
        required
        placeholder="Enter Product price"
        onChange={(e) => setDataForm({ ...dataForm, price: +e.target.value })}
      />
      <label htmlFor="discount">Enter Product Discount</label>
      <Input
        value={dataForm.discount || ""}
        type="number"
        id="discount"
        min={5}
        max={70}
        name="discount"
        placeholder="Enter Product discount"
        onChange={(e) =>
          setDataForm({ ...dataForm, discount: +e.target.value })
        }
      />
      <label htmlFor="description">Enter Product Description</label>
      <Input
        value={dataForm.description}
        type="text"
        id="description"
        name="description"
        required
        placeholder="Enter Product description"
        onChange={(e) =>
          setDataForm({ ...dataForm, description: e.target.value })
        }
      />

      <label htmlFor="category">Choose a category</label>
      <select
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        name="category"
        id="category"
        value={dataForm.category}
        onChange={(e) => setDataForm({ ...dataForm, category: e.target.value })}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.category}>
            {category.category}
          </option>
        ))}
      </select>
      {categorySizes.length > 0 && (
        <label htmlFor="size" className="pb-2">
          Select sizes for this product
        </label>
      )}
      <ul className="flex items-center gap-4 flex-wrap">
        {categorySizes.map((size: any, index) => {
          return (
            <Button
              type="button"
              key={size.id}
              onClick={() => handleSizeClick(size.id, size.name)}
              className={
                dataForm.productSizes?.some(
                  (productSize: any) => productSize.sizeId === size.id
                )
                  ? "bg-green-500 text-white"
                  : ""
              }
            >
              {size.name}
            </Button>
          );
        })}
      </ul>
      <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <div>
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            checked={checkbox}
            onChange={handleCheckboxChange}
          />
        </div>
        <div className="space-y-1 leading-none">
          <p className="font-semibold">Featured</p>
          <div>This product will appear on the home page</div>
        </div>
      </div>
      <label htmlFor="image">Product Images</label>
      <ImageUpload
        value={dataForm.imageURLs}
        onChange={handleImageUrlsChange}
        folder="products"
        maxFiles={5}
        disabled={isLoading}
      />
      <Button disabled={isLoading} type="submit" className="mt-2 bg-green-600">
        Save Changes
      </Button>
    </form>
  );
};

export default EditForm;
