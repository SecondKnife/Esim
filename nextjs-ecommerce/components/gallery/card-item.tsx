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

  if (!isMounted) {
    return null;
  }

      // Map country names to image URLs
      const countryImages: { [key: string]: string } = {
        "Thailand": "https://kemal-web-storage.s3.eu-north-1.amazonaws.com/thailand.png",
        "Singapore": "https://kemal-web-storage.s3.eu-north-1.amazonaws.com/singapore.png",
        "USA": "https://kemal-web-storage.s3.eu-north-1.amazonaws.com/usa.png",
        "Japan": "https://kemal-web-storage.s3.eu-north-1.amazonaws.com/japan.png",
        "Europe": "https://kemal-web-storage.s3.eu-north-1.amazonaws.com/europe.png",
        "Asia": "https://kemal-web-storage.s3.eu-north-1.amazonaws.com/asia.png",
        "Korea": "https://kemal-web-storage.s3.eu-north-1.amazonaws.com/korea.png",
        "Australia": "https://kemal-web-storage.s3.eu-north-1.amazonaws.com/australia.png",
      };

  const imageUrl = countryImages[category] || "https://kemal-web-storage.s3.eu-north-1.amazonaws.com/default.png";

  return (
    <Card>
      <CardContent className="flex aspect-square justify-center relative ">
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
        />
        <div className="absolute left-8 bottom-8 flex gap-2 flex-col w-24">
          <p className="text-white font-bold text-2xl drop-shadow-lg">
            {category}
          </p>
          <Button className="bg-white text-black hover:bg-gray-100">Shop</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardItem;
