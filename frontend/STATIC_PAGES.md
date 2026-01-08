# Static Pages Configuration

Tất cả các trang đã được chuyển sang client-side rendering để tránh lỗi 500 và màn hình trắng khi API chưa sẵn sàng.

## Các thay đổi đã thực hiện

### 1. Chuyển từ Server Components sang Client Components
- Tất cả các trang đã được thêm `"use client"` directive
- Xóa các `async` functions và `await` trong server components
- Sử dụng React Query để fetch data client-side

### 2. Xóa Dynamic Exports
- Đã xóa `export const dynamic = 'force-dynamic'`
- Đã xóa `export const revalidate = 0`
- Đã xóa `generateMetadata` async functions

### 3. Sử dụng React Query
Tất cả data fetching được thực hiện qua React Query với:
- Retry logic (2 lần retry)
- Loading states
- Error handling
- Stale time để cache data

### 4. Error Handling
Mỗi trang đều có:
- Loading state với skeleton UI
- Error state với thông báo lỗi
- Empty state khi không có data
- Fallback UI khi API chưa sẵn sàng

## Các trang đã được cập nhật

1. **Homepage** (`app/(routes)/page.tsx`)
   - Fetch categories và products client-side
   - Hiển thị loading/error states

2. **Shop Page** (`app/(routes)/shop/page.tsx`)
   - Fetch products client-side
   - Filter và search hoạt động client-side

3. **Product Detail** (`app/(routes)/product/[productId]/page.tsx`)
   - Fetch product và related products client-side
   - Error handling khi product không tồn tại

4. **Featured Page** (`app/(routes)/featured/page.tsx`)
   - Fetch featured products client-side

5. **Category Page** (`app/(routes)/shop/[category]/page.tsx`)
   - Fetch category products client-side

6. **Sidebar Component** (`app/(routes)/shop/_components/sidebar-products.tsx`)
   - Fetch categories và products client-side

7. **Static Pages** (contact, faq, terms, privacy, policy, guide, cookies)
   - Xóa dynamic exports
   - Giữ nguyên static content

## Lợi ích

1. **Không bị lỗi 500**: Trang sẽ luôn render được, ngay cả khi API chưa sẵn sàng
2. **Better UX**: Loading states và error messages rõ ràng
3. **Static Export**: Có thể build thành static files cho CloudFront
4. **Caching**: React Query cache data để giảm API calls
5. **Retry Logic**: Tự động retry khi API call fail

## Cách hoạt động

1. Trang được render ngay lập tức với loading state
2. React Query fetch data từ backend API
3. Khi data load xong, UI được update
4. Nếu có lỗi, hiển thị error message
5. Data được cache để tránh refetch không cần thiết

## Lưu ý

- Tất cả API calls đều qua `lib/api-client.ts`
- Environment variable `NEXT_PUBLIC_API_URL` phải được set đúng
- Backend server phải chạy và accessible từ frontend
- CORS phải được cấu hình đúng trong backend
