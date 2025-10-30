# Hướng dẫn Quản lý Ảnh Categories

## 📋 Tổng quan

Ảnh trong **Top Category** section bây giờ được quản lý qua:
- **Database**: Bảng `Billboard` với field `imageURL`
- **Storage**: Cloudflare R2 (folder `categories/`)
- **Admin Panel**: Có thể edit ảnh qua giao diện

---

## 🎯 Cách Hoạt Động

### 1. **Database Structure**

```
Billboard Table:
├── id (billboard_thailand, billboard_singapore, ...)
├── billboard (tên hiển thị)
└── imageURL (URL ảnh từ R2 hoặc Unsplash)

Category Table:
├── id
├── category
├── billboard
└── billboardId (liên kết với Billboard.id)
```

### 2. **Flow**
```
Homepage
  → CarouselSpacing component
    → CardItem component
      → Fetch billboard từ /api/billboards/edit/[id]
        → Hiển thị billboard.imageURL
```

---

## 📸 Upload Ảnh Categories Lên R2

### Cách 1: Upload Tự Động (Khuyến nghị)

```bash
npx tsx scripts/upload-category-images.ts
```

Script sẽ:
1. Download ảnh từ Unsplash
2. Upload lên R2 folder `categories/`
3. Update Billboard.imageURL trong database
4. Tự động áp dụng

### Cách 2: Upload Thủ Công qua Admin Panel

1. **Vào Admin Panel**
   ```
   http://localhost:3000/admin/billboards
   ```

2. **Click vào billboard cần edit**
   - Thailand
   - Singapore
   - USA
   - Japan
   - Europe
   - Korea
   - Australia
   - Asia

3. **Upload ảnh mới**
   - Chọn file ảnh
   - Click Save
   - Ảnh sẽ được upload lên R2

4. **Xem kết quả**
   - Vào homepage
   - Scroll xuống Top Category
   - Ảnh mới sẽ hiển thị

### Cách 3: Upload Qua Cloudflare Dashboard

1. **Truy cập Cloudflare R2**
   ```
   https://dash.cloudflare.com → R2 → Your Bucket
   ```

2. **Tạo folder `categories/`**

3. **Upload ảnh**
   - thailand.jpg
   - singapore.jpg
   - usa.jpg
   - japan.jpg
   - europe.jpg
   - korea.jpg
   - australia.jpg
   - asia.jpg

4. **Copy URLs công khai**
   ```
   https://pub-xxx.r2.dev/categories/thailand.jpg
   ```

5. **Update database**
   ```bash
   npx prisma studio
   ```
   - Mở bảng Billboard
   - Update imageURL cho từng billboard

---

## 🖼️ Kích Thước Ảnh Khuyến Nghị

- **Kích thước**: 800x800px (vuông)
- **Format**: JPG hoặc PNG
- **Dung lượng**: < 500KB
- **Tỷ lệ**: 1:1 (aspect ratio)

---

## 🎨 Danh Sách Billboards

| ID | Billboard | Category | Ảnh Mặc Định |
|---|---|---|---|
| billboard_thailand | Thailand | Thailand | Wat Arun temple |
| billboard_singapore | Singapore | Singapore | Marina Bay Sands |
| billboard_usa | USA | USA | Statue of Liberty |
| billboard_japan | Japan | Japan | Tokyo skyline |
| billboard_europe | Europe | Europe | Eiffel Tower |
| billboard_korea | Korea | Korea | Seoul cityscape |
| billboard_australia | Australia | Australia | Sydney Opera House |
| billboard_asia | Asia | Asia | Asian landmarks |

---

## 🔧 Update Ảnh Cho 1 Billboard Cụ Thể

### Via Code:

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

await prisma.billboard.update({
  where: { id: 'billboard_thailand' },
  data: { 
    imageURL: 'https://pub-xxx.r2.dev/categories/thailand-new.jpg' 
  },
});
```

### Via Prisma Studio:

```bash
npx prisma studio
```

1. Chọn table `Billboard`
2. Find billboard cần update
3. Edit `imageURL` field
4. Save

---

## 📦 Cấu Trúc R2

```
your-bucket/
├── categories/           ← Ảnh categories/billboards
│   ├── thailand.jpg
│   ├── singapore.jpg
│   ├── usa.jpg
│   └── ...
├── products/            ← Ảnh sản phẩm
│   ├── product_1.jpg
│   └── ...
└── banners/             ← Banners/Hero images
    └── hero.jpg
```

---

## 🚀 Quick Commands

```bash
# Upload tất cả ảnh categories lên R2
npx tsx scripts/upload-category-images.ts

# Re-seed với ảnh mới
npx tsx prisma/seed-simple.ts

# Xem database
npx prisma studio

# Chạy dev server
npm run dev
```

---

## 💡 Tips

### Tìm ảnh đẹp cho categories:

1. **Unsplash**: https://unsplash.com
   - Search: "thailand landmark"
   - Download ảnh
   - Upload lên R2

2. **Pexels**: https://pexels.com
   - Free stock photos
   - No attribution required

3. **Pixabay**: https://pixabay.com
   - Free images
   - Commercial use

### Optimize ảnh trước khi upload:

```bash
# Using ImageMagick
convert input.jpg -resize 800x800 -quality 80 output.jpg

# Online tools:
# - TinyPNG.com
# - Squoosh.app
```

---

## 🔄 Workflow Thêm Category Mới

1. **Tạo Billboard**
   ```sql
   INSERT INTO Billboard (id, billboard, imageURL)
   VALUES ('billboard_vietnam', 'Vietnam', 'https://...');
   ```

2. **Tạo Category**
   ```sql
   INSERT INTO Category (id, billboard, billboardId, category)
   VALUES ('cat_vietnam', 'Vietnam', 'billboard_vietnam', 'Vietnam');
   ```

3. **Upload ảnh lên R2**
   - Folder: `categories/`
   - Filename: `vietnam.jpg`

4. **Refresh trang** để xem

---

## ❓ Troubleshooting

### Ảnh không hiển thị:

1. **Check R2 URL**
   ```bash
   curl https://pub-xxx.r2.dev/categories/thailand.jpg
   ```

2. **Check database**
   ```bash
   npx prisma studio
   ```
   - Xem Billboard.imageURL có đúng không

3. **Check next.config.js**
   - Domain có trong `remotePatterns` chưa?

4. **Clear cache**
   ```bash
   rm -rf .next
   npm run dev
   ```

### Upload R2 failed:

- Check `.env` có đầy đủ R2 credentials
- Check `R2_BUCKET_NAME` đã set chưa
- Check API permissions

---

## 📚 Related Files

- `components/gallery/card-item.tsx` - Component hiển thị ảnh
- `prisma/seed-simple.ts` - Seed billboards
- `app/api/billboards/edit/[id]/route.ts` - API get billboard
- `scripts/upload-category-images.ts` - Upload script

---

🎉 **Ảnh categories bây giờ linh hoạt và dễ quản lý qua Admin Panel hoặc R2!**

