"use client";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Billboard } from "@/types";
import LoadingSkeleton from "../loading-skeleton";
import { Button } from "../ui/button";

type CardProps = {
  billboard?: Billboard;
  category: string;
};

const CardItem = ({ billboard, category }: CardProps) => {
  // Không cần fetch nữa vì data đã được pass từ parent
  if (!billboard) {
    return <LoadingSkeleton />;
  }

  const imageUrl = billboard.imageURL || ""

  return (
    <Card className="border-border bg-card">
      <CardContent className="flex aspect-square justify-center relative p-0">
        <Image
          src={imageUrl}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "5px",
          }}
          fill
          alt={`${category} eSIM/SIM`}
          sizes="any"
          className="object-cover"
        />
        <div className="absolute left-8 bottom-8 flex gap-2 flex-col w-24">
          <p className="text-white font-bold text-2xl drop-shadow-lg">
            {category}
          </p>
          <Button className="bg-background text-foreground hover:bg-muted border-border">Shop</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardItem;
