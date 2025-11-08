"use client";
import TitleHeader from "@/app/(admin)/_components/title-header";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";
import formatDate, { sortByDate } from "@/app/utils/formateDate";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

type Sizes = {
  id: string;
  name: string;
  category: string;
  createdAt: string;
};

const TableSizes = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 5;

  const { error, data, isLoading } = useQuery({
    queryKey: ["sizes"],
    queryFn: async () => {
      const { data } = await axios.get("/api/sizes");
      const sortedData = sortByDate(data);
      return sortedData as Sizes[];
    },
  });

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
        title="Sizes"
        count={data?.length}
        description="Manage sizes for your store"
        url="/admin/sizes/new"
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
              <TableCell>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Value</p>
              </TableCell>
              <TableCell align="center">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Date</p>
              </TableCell>
              <TableCell align="right">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Actions</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProducts?.map((order) => (
              <TableRow
                key={order.id}
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
                <TableCell component="th" scope="row" align="left" sx={{ color: 'inherit !important' }}>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{order.name}</p>
                </TableCell>
                <TableCell align="center" sx={{ color: 'inherit !important' }}>
                  <p className="text-gray-900 dark:text-gray-100">{formatDate(order.createdAt)}</p>
                </TableCell>
                <TableCell align="right" sx={{ color: 'inherit !important' }}>
                  <div className="flex items-center gap-2 justify-end">
                    <button>
                      <DeleteIcon className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer" />
                    </button>
                    <EditIcon className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer" />
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

export default TableSizes;
