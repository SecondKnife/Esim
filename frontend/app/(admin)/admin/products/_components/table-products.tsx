"use client";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Spinner from "@/components/Spinner";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import formatDate, { sortByDate } from "@/app/utils/formateDate";
import TitleHeader from "@/app/(admin)/_components/title-header";
import { parseImageURLs, formatVND } from "@/lib/utils";

type createData = {
  title: string;
  description: string;
  price: number;
  featured: boolean;
  id: string;
  imageURLs: string | string[];
  category: string;
  createdAt: string;
};

export default function ProductTable() {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 5;

  const queryClient = useQueryClient();

  const { error, data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.get("/api/product");

      const sortedData = sortByDate(data);
      return sortedData as createData[];
    },
  });

  const deleteTask = async (id: string) => {
    try {
      const res = await axios.delete(`/api/product/${id}`);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const offset = currentPage * productsPerPage;
  const currentProducts = data?.slice(offset, offset + productsPerPage);

  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Something went wrong!</p>;
  }
  return (
    <>
      <TitleHeader
        title="Products"
        count={data?.length}
        description="Manage products for your store"
        url="/admin/products/new"
      />
      <TableContainer 
        component={Paper}
        className="bg-white dark:bg-gray-800"
        sx={{
          '& .MuiTableCell-root': {
            borderColor: 'rgba(224, 224, 224, 1)',
            color: 'inherit',
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            fontWeight: 600,
          },
          '& .dark .MuiTableHead-root .MuiTableCell-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width={5}>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Image</p>
              </TableCell>
              <TableCell>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Name</p>
              </TableCell>
              <TableCell align="center">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Categories</p>
              </TableCell>
              <TableCell align="center">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Featured</p>
              </TableCell>
              <TableCell align="center">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Price</p>
              </TableCell>
              <TableCell align="center">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Description</p>
              </TableCell>
              <TableCell align="center">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Date</p>
              </TableCell>
              <TableCell align="center">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Actions</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProducts?.map((product: createData) => (
              <TableRow
                key={product.id}
                sx={{ 
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  },
                  "& .dark &:hover": {
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  },
                }}
              >
                <TableCell component="th" scope="row" sx={{ color: 'inherit !important' }}>
                  <Image
                    src={parseImageURLs(product.imageURLs)[0] || "/placeholder.png"}
                    alt="Product Image"
                    className="border rounded-sm"
                    width={60}
                    height={60}
                  />
                </TableCell>
                <TableCell align="left" sx={{ color: 'inherit !important' }}>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{product.title}</p>
                </TableCell>
                <TableCell align="center" sx={{ color: 'inherit !important' }}>
                  <p className="text-gray-900 dark:text-gray-100">{product.category}</p>
                </TableCell>
                <TableCell align="center" sx={{ color: 'inherit !important' }}>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.featured 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}>
                    {product.featured ? "Yes" : "No"}
                  </span>
                </TableCell>
                <TableCell align="center" sx={{ color: 'inherit !important' }}>
                  <p className="text-gray-900 dark:text-gray-100 font-semibold">{formatVND(product.price)}</p>
                </TableCell>
                <TableCell align="center" sx={{ color: 'inherit !important' }}>
                  <p className="text-gray-900 dark:text-gray-100 text-sm">
                    {product.description.slice(0, 11)}
                    {product.description.length > 12 && "..."}
                  </p>
                </TableCell>
                <TableCell align="center" sx={{ color: 'inherit !important' }}>
                  <p className="text-gray-900 dark:text-gray-100">{formatDate(product.createdAt)}</p>
                </TableCell>
                <TableCell align="center" sx={{ color: 'inherit !important' }}>
                  <div className="flex items-center gap-2 justify-center">
                    <button>
                      <DeleteIcon
                        onClick={() => deleteTask(product.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer"
                      />
                    </button>
                    <Link href={`/admin/products/edit?productId=${product.id}`}>
                      <EditIcon className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer" />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={Math.ceil(data?.length / productsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination flex space-x-2 justify-end mt-4"}
          previousLinkClassName={"bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded text-white transition-colors"}
          nextLinkClassName={"bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded text-white transition-colors"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
          activeClassName={"bg-blue-700"}
          pageClassName="hidden"
        />
      )}
    </>
  );
}
