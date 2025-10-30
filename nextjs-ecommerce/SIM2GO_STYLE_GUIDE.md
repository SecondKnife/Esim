# 🎨 SIM2GO Style Guide Implementation

## 📋 Tổng quan

Dự án đã được thiết kế lại hoàn toàn theo phong cách **sim2go.vn** với UI hiện đại, chuyên nghiệp.

**Reference**: [https://sim2go.vn/](https://sim2go.vn/)

---

## ✅ Các thay đổi đã thực hiện

### 1. **🔤 Typography - Font Montserrat**

**File**: `app/layout.tsx`

```typescript
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ 
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});
```

**Tại sao Montserrat?**
- ✅ Font hiện đại, professional
- ✅ Hỗ trợ tiếng Việt tuyệt vời
- ✅ Dễ đọc ở mọi kích thước
- ✅ Tương tự font sim2go.vn

---

### 2. **🎨 Color Scheme - Orange Primary**

**Primary Colors**:
- **Orange 500**: `#F97316` - Buttons, CTAs, Icons
- **Orange 50**: `#FFF7ED` - Backgrounds, Highlights
- **Red 500**: `#EF4444` - Discount badges
- **Gray 900**: `#111827` - Headings
- **Gray 600**: `#4B5563` - Body text

**Inspired by sim2go.vn**:
- Orange là màu chủ đạo (giống sim2go)
- Contrast tốt, nổi bật
- Professional và thân thiện

---

### 3. **🃏 Product Card Redesign**

**File**: `components/ui/product-card.tsx`

#### **Layout Structure**:

```
┌─────────────────────────────┐
│  [Discount Badge]     Image │
│                             │
├─────────────────────────────┤
│  Title (Bold, 2 lines)      │
│  Location/Country           │
│                             │
│  📅 X ngày sử dụng          │
│  🌐 Internet tốc độ cao     │
│                             │
│  Nhà mạng: [Provider]       │
├─────────────────────────────┤
│  180.000đ         [🛒]      │
│  ─────────────────          │
│                             │
│  [Chi tiết sản phẩm]        │
└─────────────────────────────┘
```

#### **Key Features**:

✅ **Image Container**:
```tsx
<div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
  <Image className="object-cover group-hover:scale-105 duration-300" />
</div>
```

✅ **Price Display** (Giống sim2go):
```tsx
<p className="text-2xl font-extrabold text-gray-900">
  {formatVND(data.finalPrice)}
</p>
```

✅ **Cart Button** (Orange Circle):
```tsx
<button className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110">
  <ShoppingCartIcon />
</button>
```

✅ **CTA Button** (Border Orange):
```tsx
<button className="w-full py-3 px-4 border-2 border-orange-500 text-orange-500 font-semibold rounded-full hover:bg-orange-50">
  Chi tiết sản phẩm
</button>
```

#### **Card Styling**:

```tsx
className="bg-white group cursor-pointer rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
```

**Key Points**:
- `rounded-3xl` - Bo tròn nhiều (giống sim2go)
- `shadow-md` - Đổ bóng nhẹ
- `hover:shadow-xl` - Hover effect
- `border-gray-100` - Border mỏng

---

### 4. **📐 Grid Layout - Responsive**

**Desktop (xl)**: 5 columns
**Laptop (lg)**: 4 columns
**Tablet (md)**: 3 columns
**Mobile (sm)**: 2 columns
**Phone**: 1 column

```tsx
className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
```

**Giống sim2go.vn** - responsive tốt trên mọi thiết bị.

---

### 5. **🎯 Spacing & Alignment**

#### **Container Padding**:
```tsx
<div className="p-4 space-y-3">  // Card content
```

#### **Section Spacing**:
```tsx
<div className="space-y-8 py-8">  // Between sections
```

#### **Gap Between Cards**:
```tsx
gap-6  // 1.5rem (24px)
```

**Consistent với sim2go.vn** - spacing rộng rãi, thoáng đãng.

---

### 6. **✨ Hover Effects & Animations**

#### **Card Hover**:
```tsx
hover:shadow-xl transition-all duration-300
```

#### **Image Zoom**:
```tsx
group-hover:scale-105 duration-300
```

#### **Button Hover**:
```tsx
hover:scale-110 transition-all duration-200
```

**Smooth, professional** - tương tự sim2go.vn.

---

### 7. **🏷️ Discount Badge**

```tsx
<div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
  -{data.discount}%
</div>
```

**Position**: Top-left (giống sim2go)
**Shape**: `rounded-full`
**Color**: Red 500
**Shadow**: `shadow-lg`

---

### 8. **🎨 Background Colors**

**Body Background**:
```css
body {
  @apply bg-gray-50 text-foreground;
}
```

**Card Background**: White
**Stats Section**: Gradient orange/red

**Giống sim2go.vn** - background sáng, clean.

---

### 9. **📱 Best Deals Section**

**File**: `components/best-deals.tsx`

#### **Heading Style**:
```tsx
<h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
  🔥 Ưu đãi tốt nhất
</h2>
```

#### **Stats Card**:
```tsx
<div className="bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 p-8 rounded-3xl shadow-sm border border-orange-100">
  {/* 3 columns: Số ưu đãi, % giảm, Tiết kiệm */}
</div>
```

**Stats Display**:
```tsx
<div className="text-3xl font-extrabold text-orange-600">
  {products.length}
</div>
<div className="text-sm font-medium text-gray-700">
  Ưu đãi đang có
</div>
```

---

### 10. **🔧 Custom CSS Utilities**

**File**: `app/globals.css`

```css
/* Text clamping */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}
```

---

## 📊 So sánh Before/After

### **Before**:
- Font: Inter
- Border radius: `rounded-xl` (12px)
- Shadow: Nhẹ
- Colors: Neutral
- Price: `$180.00`
- Button: Simple
- Spacing: Chật

### **After (sim2go style)**:
- Font: **Montserrat** (bold, modern)
- Border radius: **`rounded-3xl`** (24px)
- Shadow: **Prominent với hover effect**
- Colors: **Orange primary**
- Price: **`180.000đ`** (to, bold)
- Button: **"Chi tiết sản phẩm"** với border orange
- Spacing: **Rộng rãi, thoáng đãng**

---

## 🎯 UI Components Comparison

### **Product Card**:

| Element | Before | After (sim2go) |
|---------|--------|----------------|
| Border Radius | 12px | **24px** |
| Shadow | `shadow` | **`shadow-md hover:shadow-xl`** |
| Price Size | `text-lg` | **`text-2xl font-extrabold`** |
| Button Style | Filled | **Border orange + white bg** |
| Cart Icon | None | **Orange circle button** |
| Image Hover | Scale 110% | **Scale 105%** |
| Badge Position | Top-right | **Top-left** |

### **Typography**:

| Element | Before | After (sim2go) |
|---------|--------|----------------|
| Heading | `text-2xl font-bold` | **`text-4xl font-extrabold`** |
| Body | Inter | **Montserrat** |
| Price | `font-semibold` | **`font-extrabold`** |
| Button | `font-medium` | **`font-semibold`** |

---

## 🚀 Kết quả

### **Desktop View**:
- ✅ Grid 5 columns (xl screens)
- ✅ Card spacing 24px
- ✅ Smooth hover effects
- ✅ Professional appearance

### **Mobile View**:
- ✅ Responsive 1-2 columns
- ✅ Touch-friendly buttons
- ✅ Readable text sizes
- ✅ Optimized images

### **Performance**:
- ✅ Font subset optimization
- ✅ Image lazy loading
- ✅ CSS transitions (GPU-accelerated)
- ✅ Smooth scrolling

---

## 📝 Code Snippets

### **Import formatVND**:
```tsx
import { formatVND } from "@/lib/utils";
```

### **Usage**:
```tsx
<p className="text-2xl font-extrabold text-gray-900">
  {formatVND(data.price)}
</p>
```

### **Button Style** (sim2go):
```tsx
<button className="w-full py-3 px-4 border-2 border-orange-500 text-orange-500 font-semibold rounded-full hover:bg-orange-50 transition-all duration-200">
  Chi tiết sản phẩm
</button>
```

### **Cart Icon Button**:
```tsx
<button className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110">
  <ShoppingCartIcon style={{ fontSize: "20px" }} />
</button>
```

---

## 🎨 Color Palette

```css
/* Orange (Primary) */
--orange-50:  #FFF7ED
--orange-500: #F97316  /* Main CTA */
--orange-600: #EA580C  /* Hover */

/* Red (Accents) */
--red-500: #EF4444     /* Discount badges */

/* Gray (Text & Borders) */
--gray-50:  #F9FAFB    /* Background */
--gray-100: #F3F4F6    /* Borders */
--gray-600: #4B5563    /* Body text */
--gray-900: #111827    /* Headings */
```

---

## ✅ Checklist

- ✅ Font Montserrat với Vietnamese subset
- ✅ Orange làm màu chủ đạo
- ✅ Product card với border-radius lớn (24px)
- ✅ Shadow effects với hover
- ✅ Button "Chi tiết sản phẩm" với border orange
- ✅ Cart icon button màu cam tròn
- ✅ Price display to, bold (2xl font-extrabold)
- ✅ Discount badge góc trái trên
- ✅ Grid responsive 1-5 columns
- ✅ Spacing rộng rãi (gap-6, p-4)
- ✅ Smooth hover animations
- ✅ Background gray-50 cho body

---

## 🔗 Reference

**Inspired by**: [sim2go.vn](https://sim2go.vn/)

**Fonts**: Montserrat (Google Fonts)

**Icons**: Material-UI Icons

**Framework**: Next.js 14 + Tailwind CSS

---

**Perfect match with sim2go.vn design! 🎉**

