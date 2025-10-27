Full Stack E-Commerce platform with admin panel and online store within a single project. Built with modern technologies such as Next.js, React, TypeScript, SQLite, ShadCN, and Tailwind CSS for user experience and administrative experience. **Ready to deploy on Netlify!**

## Features

### Admin Panel

#### Dashboard

- **Sales Overview Graph:**
  - Monitor sales growth and trends through interactive graphs.

#### Product Management

- **Add, Edit, and Delete Products:**
  - Efficiently add, update, and remove products from the admin panel.

#### Categories, Sizes, and Billboards

- **Category Management:**
  - Add, edit, or delete product categories.
- **Size Management:**
  - Add, edit, or delete available product sizes.
- **Billboard Management:**
  - Create, customize, or delete billboards for featured products.

#### User Management

- **Add New Users:**
  - Enhance user experience by adding new users.
- **Assign Administrator Privileges:**
  - Assign administrator privileges to users from the Admin Panel.
 
### Store

### Home Page

- **Top Categories Display:**
  - Explore top categories right on the home page for easy navigation.
- **Featured Products Showcase:**
  - Discover highlighted and featured products for an engaging shopping experience.
- **Search Functionality:**
  - Quickly find products using the search bar.

### Shop Page

- **Product Listing:**
  - View all available products in one place.
- **Category Filters:**
  - Narrow down your search using category filters.
- **Price Range Filters:**
  - Set a specific price range for more targeted results.
- **Sorting Options:**
  - Sort products by price (ascending/descending) and view the latest arrivals.
  
### Product Page

- **Product Details:**
  - View detailed information, including images and available sizes.
- **Add to Cart:**
  - Easily add products to your shopping cart for a seamless checkout process.

### Cart Page

- **Review and Edit Cart:**
  - View and modify items in your shopping cart.
- **Proceed to Checkout:**
  - Move seamlessly from the cart to the checkout process.
 

## Technologies Used
- Next.js 14
- React 18
- TypeScript
- Prisma + SQLite
- Clerk (Authentication)
- ShadCN UI
- Tailwind CSS
- Material-UI
- React Query

## Recent Changes

✅ **Converted to SQLite** - No more MongoDB needed!  
✅ **Removed AWS S3** - Images stored as base64 in database  
✅ **Removed Stripe** - Simplified checkout without payment gateway  
✅ **Netlify Ready** - Configured for easy deployment on Netlify  


## Screenshots

**Admin Panel**

![dashboard](https://github.com/kemalkujovic/domaci_js/assets/107282806/b73aebd7-761d-47b5-b7e2-9363e0dc889b) 

![products(admin)](https://github.com/kemalkujovic/domaci_js/assets/107282806/436f1236-d307-4712-b192-a9aaba7cb1a2) 

![product create](https://github.com/kemalkujovic/domaci_js/assets/107282806/84a15b28-cf4d-46e1-a4d3-a33c189e764d) 

![product edit admin](https://github.com/kemalkujovic/domaci_js/assets/107282806/ada29504-1727-41bb-b9d1-ec7874981815)

![orders](https://github.com/kemalkujovic/domaci_js/assets/107282806/e2150672-6d22-47f2-ad87-0dfb147ccad6)

![billboards](https://github.com/kemalkujovic/domaci_js/assets/107282806/dd30b3bc-ec52-4c36-978e-02952304e1d5)

![categori](https://github.com/kemalkujovic/domaci_js/assets/107282806/fc6f9a74-79c6-4f89-aa5d-1bf10b0e1830)

![sizes](https://github.com/kemalkujovic/domaci_js/assets/107282806/3695c3b9-6730-4d63-8fc6-a0259511c4a4)

![users](https://github.com/kemalkujovic/domaci_js/assets/107282806/9c65db2a-1a08-43a7-bd96-323f5cd3472a)

**Store**

![home](https://github.com/kemalkujovic/domaci_js/assets/107282806/47730120-f708-4b9f-99ce-115cabb37a9e)

![shop](https://github.com/kemalkujovic/domaci_js/assets/107282806/3a033398-304f-40cd-8eb8-90c61037aa19)

![product](https://github.com/kemalkujovic/domaci_js/assets/107282806/4ba4e874-d2be-4c11-97be-7d81b7f97cee)

![cart](https://github.com/kemalkujovic/domaci_js/assets/107282806/83a83ee3-0923-456b-ae59-ab5855dbc5e4)

![featured](https://github.com/kemalkujovic/domaci_js/assets/107282806/ac52016f-0c1c-48fa-8ea4-a5796d0e6b59)


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Setup database:**
```bash
# Generate Prisma Client
npx prisma generate

# Create database and tables
npx prisma migrate dev
```

3. **Run development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_API_URL=http://localhost:3000
FRONTEND_STORE_URL=http://localhost:3000
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Netlify

This project is configured and ready to deploy on Netlify! See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

### Quick Deploy:

1. Push your code to GitHub
2. Connect to Netlify
3. Set build command: `npm run build`
4. Add environment variables
5. Deploy!

Check out our [deployment documentation](./DEPLOY.md) for more details.
