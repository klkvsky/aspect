"use client";

import { Video } from "@/interfaces/video";

import { supabase } from "@/lib/supabaseClient";

import Muuri from "muuri";
import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";
import VideoCardOld from "@/components/video-card-old";
import VideoCard from "@/components/VIdeoCard";

export default function PersonalPage() {
  const pathname = usePathname();

  const [gridRefence, setGridRefence] = useState<any>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  async function fetchVideos() {
    const { data, error } = await supabase.storage.from("videos").list("", {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

    if (data) {
      console.log(data);
      setVideos(data as unknown as Video[]);
    } else {
      console.error(error);
    }
  }

  useEffect(() => {
    if (videos.length === 0) {
      fetchVideos();
    } else {
      const grid = new Muuri(".gridMuui", {
        items: ".item",
        dragEnabled: true,
        layout: {
          fillGaps: false,
          horizontal: false,
          alignRight: false,
          alignBottom: false,
          rounding: true,
        },
      });

      setGridRefence(grid);

      setTimeout(() => {
        grid.refreshItems().layout();
      }, 200);
    }
  }, [videos]);

  return (
    <main className="my-10 w-full">
      <div className="gridMuui">
        {videos.map((video: any, index: any) => (
          <div
            key={index}
            className="item"
            style={{
              width: "25%",
            }}
            id={`item-${index}`}
          >
            <div className={`item-content p-[10px] w-full h-full`}>
              <VideoCardOld
                videoURL={`https://zqjvsefawyzwxbridxjw.supabase.co/storage/v1/object/public/videos/${
                  pathname.split("/")[1]
                }/${video.name}`}
                author={video.name.split("-")[0]}
                authorImage="https://zqjvsefawyzwxbridxjw.supabase.co/storage/v1/object/public/videos/avatars/photo.jpg"
                tags={["#test", "#test2"]}
                onFullscreen={() => {
                  console.log("fullscreen");
                }}
                onLoad={() => {
                  gridRefence.refreshItems().layout();
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mx-10">
        <div className="w-[25vw]">
          {videos[0] && (
            <VideoCard
              videoMetaData={videos[1]}
              onLoad={() => {
                gridRefence.refreshItems().layout();
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
