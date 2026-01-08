"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RequestData, SelectedSize } from "@/types";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/image-upload";

type Category = {
  id: string;
  name: string;
  billboard: string;
  category: string;
};

type initialState = {
  title: string;
  description: string;
  price: string;
  category: string;
  imageURLs: string[];
  isFeatured: boolean;
  categoryId: string;
  sizes: SelectedSize[];
  discount?: string;
};

const AddProduct = () => {
  const router = useRouter();
  const [selectedSizes, setSelectedSizes] = useState<SelectedSize[]>([]);

  const initialState = {
    title: "",
    description: "",
    price: "",
    category: "",
    categoryId: "",
    imageURLs: [],
    isFeatured: false,
    sizes: selectedSizes,
    discount: "",
  };

  const [category, setCategory] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataForm, setDataForm] = useState<initialState>(initialState);

  const [availableSizes, setAvailableSizes] = useState([]);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    price: "",
    imageURLs: "",
    category: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resCategory = await axios.get("/api/categories");
        const data = resCategory.data;
        setCategory(data);
      } catch (error) {
        console.log("Error getting categories", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSizesForCategory = async () => {
      try {
        const response = await axios.get(`/api/sizes/${dataForm.categoryId}`);

        setAvailableSizes(response.data);
      } catch (error) {
        console.error("Error fetching sizes for category:", error);
      }
    };

    if (dataForm.categoryId) {
      fetchSizesForCategory();
    }
  }, [dataForm.categoryId]);

  const handleCheckboxChange = (isChecked: boolean) => {
    setDataForm((prevData) => ({ ...prevData, isFeatured: isChecked }));
  };

  const handleImageUrlsChange = (urls: string[]) => {
    setDataForm((prevData) => ({ ...prevData, imageURLs: urls }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({
      title: "",
      description: "",
      price: "",
      imageURLs: "",
      category: "",
    });

    if (
      !dataForm.title ||
      dataForm.title.length < 4 ||
      !dataForm.description ||
      dataForm.description.length < 4 ||
      !dataForm.price ||
      dataForm.imageURLs.length === 0 ||
      !dataForm.category
    ) {
      setIsLoading(false);
      setErrors((prevErrors) => ({
        ...prevErrors,
        title:
          dataForm.title.length < 4
            ? "Title must be at least 4 characters"
            : "",
        description:
          dataForm.description.length < 4
            ? "Description must be at least 4 characters"
            : "",
        price: !dataForm.price ? "Please enter a price" : "",
        imageURLs:
          dataForm.imageURLs.length === 0 ? "Please upload at least one image" : "",
        category: !dataForm.category ? "Please select a category" : "",
      }));

      return;
    }

    const convPrice = +dataForm.price;

    const requestData: RequestData = {
      title: dataForm.title,
      description: dataForm.description,
      price: convPrice,
      imageURLs: dataForm.imageURLs,
      featured: dataForm.isFeatured,
      category: dataForm.category,
      sizes: selectedSizes,
      categoryId: dataForm.categoryId,
    };

    if (dataForm.discount !== undefined && dataForm.discount !== "") {
      requestData.discount = +dataForm.discount;
    }

    try {
      const res = await axios.post("/api/product", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Product created successfully");

      router.push("/admin/products");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong!");
    }
  };

  const handleSizeClick = (sizeId: string, sizeName: string) => {
    if (!selectedSizes.some((size) => size.id === sizeId)) {
      setSelectedSizes((prevSelected) => [
        ...prevSelected,
        { id: sizeId, name: sizeName },
      ]);
    } else {
      setSelectedSizes((prevSelected) =>
        prevSelected.filter((size) => size.id !== sizeId)
      );
    }
  };

  return (
    <div className="flex justify-center items-center max-md:justify-start">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-2 max-md:min-w-[90%] min-w-[70%] border p-4 "
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
        {errors.title && <p className="text-red-500">{errors.title}</p>}
        <label htmlFor="price">Enter Product Price</label>
        <Input
          value={dataForm.price}
          type="number"
          id="price"
          min={1}
          name="price"
          required
          placeholder="Enter Product price"
          onChange={(e) => setDataForm({ ...dataForm, price: e.target.value })}
        />
        {errors.price && <p className="text-red-500">{errors.price}</p>}
        <label htmlFor="discount">Enter Product Discount</label>
        <Input
          value={dataForm.discount}
          type="number"
          id="discount"
          min={5}
          max={70}
          name="price"
          placeholder="Enter Product discount"
          onChange={(e) =>
            setDataForm({ ...dataForm, discount: e.target.value })
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
        {errors.description && (
          <p className="text-red-500">{errors.description}</p>
        )}
        <label htmlFor="category">Choose a category</label>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          name="category"
          id="category"
          required
          value={dataForm.category}
          onChange={(e) => {
            const selectedCategory = category.find(
              (c) => c.category === e.target.value
            );
            setDataForm({
              ...dataForm,
              category: e.target.value,
              categoryId: selectedCategory?.id || "",
            });
          }}
        >
          <option value="">Select a category</option>
          {category.length > 0 &&
            category?.map((category) => {
              return (
                <option key={category.id} value={category.category}>
                  {category.category}
                </option>
              );
            })}
        </select>
        <div className="my-2 gap-2 flex flex-wrap flex-col">
          {availableSizes.length > 0 && (
            <label htmlFor="size" className="pb-2">
              Select a size for this product
            </label>
          )}
          <ul className="flex items-center gap-4 flex-wrap">
            {availableSizes.map((size: any) => (
              <Button
                type="button"
                onClick={() => handleSizeClick(size.id, size.name)}
                className={
                  selectedSizes.some(
                    (selectedSize) => selectedSize.id === size.id
                  )
                    ? "bg-green-600"
                    : ""
                }
                key={size.id}
              >
                {size.name}
              </Button>
            ))}
          </ul>
        </div>
        <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <div>
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={dataForm.isFeatured}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
            />
          </div>
          <div className="space-y-1 leading-none">
            <p className="font-semibold">Featured</p>
            <div>This product will appear on the home page</div>
          </div>
        </div>
        <label htmlFor="image">Add Product Images</label>
        <ImageUpload
          value={dataForm.imageURLs}
          onChange={handleImageUrlsChange}
          folder="products"
          maxFiles={5}
          disabled={isLoading}
        />
        {errors.imageURLs && <p className="text-red-500">{errors.imageURLs}</p>}
        <Button disabled={isLoading} className="mt-2 bg-green-600">
          Add Product
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
