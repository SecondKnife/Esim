import CarouselFeatured from "@/components/CarouselFeatured";
import { CarouselSpacing } from "@/components/CarouselSpacing";
import Footer from "@/components/footer";
import TitleHeader from "@/components/title-header";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";
import { getAllProducts, getCategories } from "@/lib/apiCalls";
import { Product } from "@/types";

const HomePage = async () => {
  const category = await getCategories();
  const products = await getAllProducts();

  const featuredProducts = products.filter(
    (product) => product.featured
  );

  return (
    <>
      <Container>
        <Billboard />
      </Container>
      <TitleHeader title="Top Category" url="/shop" />
      <CarouselSpacing data={category} />
      <div className="mb-24">
        <TitleHeader title="Featured Products" url="/featured" />
        {featuredProducts.length > 0 && (
          <CarouselFeatured
            data={featuredProducts.map((product) => {
              const { discount, finalPrice, ...rest } = product;
              return {
                ...rest,
                price: product.price.toString(),
                finalPrice: finalPrice ?? 0,
                ...(typeof discount !== "undefined" && discount !== null ? { discount } : {}),
              };
            })}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
