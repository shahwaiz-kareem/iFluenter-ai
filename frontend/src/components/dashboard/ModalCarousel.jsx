"use client";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { setPreferences } from "@/lib/features/preferences/preferences.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { useEffect, useState } from "react";

const ModalCarousel = ({ children, item }) => {
  const [api, setApi] = useState();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.preferences[item + "s"]);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      const itemIndex = api.selectedScrollSnap();
      // console.log(itemIndex, items, items[itemIndex]);
      dispatch(setPreferences({ [item]: items[itemIndex] }));
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api, item, items?.length]);
  return (
    <Carousel setApi={setApi}>
      <CarouselContent>{children}</CarouselContent>
      <CarouselPrevious className="absolute left-3" />
      <CarouselNext className="absolute right-3" />
    </Carousel>
  );
};

export default ModalCarousel;
