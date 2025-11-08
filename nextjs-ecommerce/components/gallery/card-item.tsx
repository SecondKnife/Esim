"use client";
import { Card, CardContent } from "../ui/card";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Billboard } from "@/types";
import LoadingSkeleton from "../loading-skeleton";
import { Button } from "../ui/button";

type CardProps = {
  billboard: string;
  category: string;
};

const CardItem = ({ billboard, category }: CardProps) => {
  const [billboards, setBillboards] = useState<Billboard>();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(`/api/billboards/edit/${billboard}`);
      setBillboards(data.data);
    };
    fetchData();
  }, [billboard]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !billboards) {
    return <LoadingSkeleton />;
  }

  const imageUrl = billboards.imageURL || ""

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
