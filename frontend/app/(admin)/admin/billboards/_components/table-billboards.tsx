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
import Link from "next/link";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";
import TitleHeader from "@/app/(admin)/_components/title-header";
import formatDate, { sortByDate } from "@/app/utils/formateDate";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { R2_BASE_URL } from "@/lib/r2-urls";

type Billboards = {
  id: string;
  billboard: string;
  imageURL: string;
  createdAt: string;
};

/**
 * Get the correct image URL from various formats
 * - If base64 (data:image/...), return as-is
 * - If full URL (http:// or https://), return as-is
 * - If relative path, prepend R2_BASE_URL
 */
const getImageUrl = (imageURL: string | null | undefined): string => {
  if (!imageURL) {
    return "/placeholder.png";
  }

  // Base64 image (from old upload method)
  if (imageURL.startsWith("data:image/")) {
    return imageURL;
  }

  // Already a full URL (from R2 or external source)
  if (imageURL.startsWith("http://") || imageURL.startsWith("https://")) {
    return imageURL;
  }

  // Relative path - prepend R2 base URL
  const cleanPath = imageURL.startsWith("/") ? imageURL.slice(1) : imageURL;
  return `${R2_BASE_URL}/${cleanPath}`;
};

/**
 * Billboard Image Component
 * Handles different image formats: base64, full URL, or relative path
 * Uses regular img tag for better error handling and base64 support
 */
const BillboardImage = ({ imageURL }: { imageURL: string | null | undefined }) => {
  const [imgSrc, setImgSrc] = React.useState<string>(() => {
    if (!imageURL) return "/placeholder.png";
    if (imageURL.startsWith("data:image/")) return imageURL;
    return getImageUrl(imageURL);
  });
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc("/placeholder.png");
    }
  };

  return (
    <img
      src={imgSrc}
      alt="billboard Image"
      className="border rounded-sm object-cover w-full h-full"
      onError={handleError}
      loading="lazy"
    />
  );
};

const TableBillboards = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 5;
  const queryClient = useQueryClient();

  const { error, data, isLoading } = useQuery({
    queryKey: ["billboards"],
    queryFn: async () => {
      const { data } = await axios.get("/api/billboards");

      const sortedData = sortByDate(data);
      return sortedData as Billboards[];
    },
  });

  const deleteTask = async (id: string) => {
    try {
      const res = await axios.delete(`/api/billboards/edit/${id}`);
      queryClient.invalidateQueries({ queryKey: ["billboards"] });
      toast.success("Billboards deleted");
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
        title="Billboards"
        count={data?.length}
        description="Manage billboards for your store"
        url="/admin/billboards/new"
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
              <TableCell width="100px">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Image</p>
              </TableCell>
              <TableCell align="left">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Billboard</p>
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
            {currentProducts?.map((billboard) => (
              <TableRow
                key={billboard.id}
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
                  <div className="relative w-[60px] h-[60px]">
                    <BillboardImage imageURL={billboard.imageURL} />
                  </div>
                </TableCell>
                <TableCell component="th" scope="row" sx={{ color: 'inherit !important' }}>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{billboard.billboard}</p>
                </TableCell>
                <TableCell align="center" sx={{ color: 'inherit !important' }}>
                  <p className="text-gray-900 dark:text-gray-100">{formatDate(billboard.createdAt)}</p>
                </TableCell>
                <TableCell align="center" sx={{ color: 'inherit !important' }}>
                  <div className="flex items-center gap-2 justify-center">
                    <button>
                      <DeleteIcon
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer"
                        onClick={() => deleteTask(billboard.id)}
                      />
                    </button>
                    <Link href={`/admin/billboards/edit/${billboard.id}`}>
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
};

export default TableBillboards;
