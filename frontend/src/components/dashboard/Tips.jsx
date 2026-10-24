"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TipsCard from "./TipsCard";
import { Card, CardHeader } from "../ui/card";

const Tips = ({ randomTips }) => {
  return (
    <Card className="px-2 pb-4 pt-2  w-full  rounded-lg shadow-md h-full mx-auto ">
      <CardHeader className="text-xl font-bold  mb-4">
        💡 Tips for today
      </CardHeader>
      <Carousel className="w-full h-full">
        <CarouselContent className="-ml-1 max-w-full h-full ">
          {randomTips?.map((tip, index) => (
            <CarouselItem
              key={index + tip?._id}
              className="pl-1  h-full  w-2 md:basis-1/2 lg:basis-1/3 "
            >
              <div className="p-1 h-full">
                <TipsCard
                  title={tip?.title}
                  description={tip?.description}
                  icon={tip?.icon}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-3" />
        <CarouselNext className="absolute right-3" />
      </Carousel>
    </Card>
  );
};

export default Tips;
