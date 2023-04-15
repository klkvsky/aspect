import { Video } from "@/interfaces/video";

import { useEffect, useState } from "react";
import VideoCard from "./MoodbardCardVideoCard";

import Muuri from "muuri";

export default function MoodbardCard(props: { videos: Video[] }) {
  const { videos } = props;
  const [grid2Refence, setgrid2Refence] = useState<any>(null);

  useEffect(() => {
    if (videos.length !== 0) {
      const grid2 = new Muuri(".grid2Muui", {
        items: ".item",
        dragEnabled: false,
        layout: {
          fillGaps: true,
          horizontal: false,
          alignRight: false,
          alignBottom: false,
          rounding: false,
        },
      });

      setgrid2Refence(grid2);

      setTimeout(() => {
        grid2.refreshItems().layout();
      }, 200);

      return () => {
        grid2.destroy();
      };
    }
  }, [videos]);

  return (
    <div className="w-full h-full max-h-[400px] overflow-scroll no-scrollbar relative border border-[#363636] rounded-[14px] bg-black/80 backdrop-blur-md">
      <div className="grid2Muui w-full h-full">
        {videos.map((video: any, index: number) => (
          <div
            key={index}
            className="item relative"
            data-name={video.name}
            id={`item-${index}`}
          >
            <div className={`item-content p-[4px] w-full h-full relative z-10`}>
              <VideoCard
                videoMetaData={video}
                onLoad={() => {
                  grid2Refence.refreshItems().layout();
                }}
                onDecrease={() => {
                  console.log("");
                }}
                onIncrease={() => {
                  console.log("");
                }}
                isUser={false}
              />
            </div>
          </div>
        ))}
        {videos.map((video: any, index: number) => (
          <div
            key={index}
            className="item relative"
            data-name={video.name}
            id={`item-${index}`}
          >
            <div className={`item-content p-[4px] w-full h-full relative z-10`}>
              <VideoCard
                videoMetaData={video}
                onLoad={() => {
                  grid2Refence.refreshItems().layout();
                }}
                onDecrease={() => {
                  console.log("");
                }}
                onIncrease={() => {
                  console.log("");
                }}
                isUser={false}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
