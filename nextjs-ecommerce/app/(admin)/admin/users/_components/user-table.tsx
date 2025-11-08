"use client";
import TitleHeader from "@/app/(admin)/_components/title-header";
import axios from "axios";
import { useState } from "react";
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
import Image from "next/image";
import Link from "next/link";
import formatDate from "@/app/utils/formateDate";
import Spinner from "@/components/Spinner";
import ReactPaginate from "react-paginate";
import toast from "react-hot-toast";

type UserData = {
  user: User[];
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

const UserTable = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 5;
  const queryClient = useQueryClient();

  const { error, data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get<UserData>("/api/clerk/users");
      const data = res.data.user;
      return data;
    },
  });

  const deleteUser = async (id: string) => {
    try {
      const res = await axios.delete(`/api/clerk/users/${id}`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted");
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
        title="Manage user"
        description="Manage admin users"
        url="/admin/users/new"
        count={data?.length}
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
                <p className="font-semibold text-gray-900 dark:text-gray-100">Role</p>
              </TableCell>
              <TableCell align="center">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Email</p>
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
            {currentProducts?.map((user: User) => {
              const date = new Date(user.createdAt);
              return (
                <TableRow
                  key={user.id}
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
                    <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </TableCell>
                  <TableCell align="left" sx={{ color: 'inherit !important' }}>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{user.name}</p>
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'inherit !important' }}>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.role === "ADMIN" 
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" 
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'inherit !important' }}>
                    <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'inherit !important' }}>
                    <p className="text-gray-900 dark:text-gray-100">{formatDate(date.toString())}</p>
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'inherit !important' }}>
                    <div className="flex items-center gap-2 justify-center">
                      <button onClick={() => deleteUser(user.id)}>
                        <DeleteIcon className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer" />
                      </button>
                      <Link href={`/admin/users/edit/${user.id}`}>
                        <EditIcon className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
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

export default UserTable;
