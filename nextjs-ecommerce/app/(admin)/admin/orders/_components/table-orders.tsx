"use client";
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
import TitleHeader from "@/app/(admin)/_components/title-header";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

type OrderItem = {
  id: string;
  orderId: string;
  productName: string;
  product: {
    simType?: string;
  };
};

type Order = {
  id: string;
  isPaid: boolean;
  phone: string;
  address: string;
  createdAt: string;
  orderItems: OrderItem[];
  status: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
};

const TableOrders = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const productsPerPage = 5;
  const queryClient = useQueryClient();

  const { error, data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await axios.get("/api/orders");
      const sortedData = sortByDate(data);
      return sortedData as Order[];
    },
  });

  const offset = currentPage * productsPerPage;
  const currentProducts = data?.slice(offset, offset + productsPerPage);

  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    try {
      await axios.patch(`/api/orders/${orderId}`, { status: newStatus });
      toast.success("Cập nhật trạng thái đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Có lỗi xảy ra");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string } } = {
      pending_payment: { label: "Chờ thanh toán", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
      paid: { label: "Đã thanh toán", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
      shipping: { label: "Đang giao hàng", className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
      delivered: { label: "Đã giao hàng", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
      cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
    };
    const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const methodMap: { [key: string]: string } = {
      bank_transfer: "Chuyển khoản",
      visa: "Visa/Mastercard",
      cod: "COD",
    };
    return methodMap[method] || method;
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
        title="Orders"
        count={data?.length}
        description="Manage orders for your store"
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
                <p className="font-semibold text-gray-900 dark:text-gray-100">Khách hàng</p>
              </TableCell>
              <TableCell>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Sản phẩm</p>
              </TableCell>
              <TableCell>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Phương thức thanh toán</p>
              </TableCell>
              <TableCell align="center">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Trạng thái</p>
              </TableCell>
              <TableCell align="center">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Địa chỉ giao hàng</p>
              </TableCell>
              <TableCell align="center">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Ngày đặt</p>
              </TableCell>
              <TableCell align="center">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Thao tác</p>
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
                <TableCell 
                  component="th" 
                  scope="row"
                  sx={{ color: 'inherit !important' }}
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 !text-gray-900 dark:!text-gray-100">{order.customerName || "N/A"}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 !text-gray-600 dark:!text-gray-400">{order.customerPhone || order.phone}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 !text-gray-500 dark:!text-gray-500">{order.customerEmail}</p>
                  </div>
                </TableCell>
                <TableCell sx={{ color: 'inherit !important' }}>
                  <div className="space-y-1">
                    {order.orderItems.slice(0, 2).map((item) => (
                      <p key={item.id} className="text-sm text-gray-900 dark:text-gray-100 font-medium !text-gray-900 dark:!text-gray-100">
                        {item.productName}
                        {item.product?.simType && (
                          <span className="ml-2 text-xs text-gray-600 dark:text-gray-400 !text-gray-600 dark:!text-gray-400">
                            ({item.product.simType})
                          </span>
                        )}
                      </p>
                    ))}
                    {order.orderItems.length > 2 && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 !text-gray-600 dark:!text-gray-400">
                        +{order.orderItems.length - 2} sản phẩm khác
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell sx={{ color: 'inherit !important' }}>
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-medium !text-gray-900 dark:!text-gray-100">
                    {getPaymentMethodLabel(order.paymentMethod || "")}
                  </p>
                </TableCell>
                <TableCell align="center" sx={{ color: 'inherit !important' }}>
                  {getStatusBadge(order.status || "pending_payment")}
                </TableCell>
                <TableCell align="center" sx={{ color: 'inherit !important' }}>
                  <p className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate !text-gray-900 dark:!text-gray-100">
                    {order.deliveryAddress || order.address || "N/A"}
                  </p>
                </TableCell>
                <TableCell align="center" sx={{ color: 'inherit !important' }}>
                  <p className="text-sm text-gray-900 dark:text-gray-100 !text-gray-900 dark:!text-gray-100">
                    {formatDate(order.createdAt)}
                  </p>
                </TableCell>
                <TableCell align="center">
                  <div className="flex flex-col gap-2">
                    {order.status === "pending_payment" && order.paymentMethod === "cod" && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "shipping")}
                        disabled={updatingOrder === order.id}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-xs"
                      >
                        {updatingOrder === order.id ? "Đang xử lý..." : "Xác nhận giao hàng"}
                      </Button>
                    )}
                    {order.status === "shipping" && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "delivered")}
                        disabled={updatingOrder === order.id}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs"
                      >
                        {updatingOrder === order.id ? "Đang xử lý..." : "Xác nhận đã giao"}
                      </Button>
                    )}
                    {order.status === "pending_payment" && order.paymentMethod === "bank_transfer" && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "paid")}
                        disabled={updatingOrder === order.id}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                      >
                        {updatingOrder === order.id ? "Đang xử lý..." : "Xác nhận đã thanh toán"}
                      </Button>
                    )}
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

export default TableOrders;
