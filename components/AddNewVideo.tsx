"use client";

import { useSupabase } from "@/app/supabase-provider";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { convertVideoToBinary } from "@/lib/convertVideoToBinary";

export default function AddNewVideo(props: {
  addNewVideoToGrid: () => void;
  videoLength: number;
}) {
  const { addNewVideoToGrid, videoLength } = props;
  const pathname = usePathname();
  const { supabase } = useSupabase();

  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState("");

  function getAspectRatio(videoFile: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.oncanplaythrough = () => {
        const aspectRatio = video.videoWidth / video.videoHeight;
        resolve(aspectRatio);
      };
      video.onerror = () => {
        reject(new Error("Unable to retrieve aspect ratio"));
      };
      video.src = URL.createObjectURL(videoFile);
    });
  }

  function generateUUID(): string {
    let d = new Date().getTime();
    if (
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
    ) {
      d += performance.now(); // use high-precision timer if available
    }
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }

  async function uploadVideo(file: File) {
    setIsUploading(true);
    const newAspectRatio = await getAspectRatio(file);

    console.log(file);

    console.log("started upload");
    const options = {
      method: "POST",
      headers: { "Content-Type": "video/mp4" },
      body: await convertVideoToBinary(file),
    };

    await fetch(
      `https://storage.googleapis.com/upload/storage/v1/b/aspect-public-videos/o?uploadType=media&name=${
        pathname.split("/")[1]
      }/${file.name + "-" + file.lastModified}`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setName(response.name);
        AddToSupabase(response.name, newAspectRatio);
      })
      .catch((err) => console.error(err));
  }

  async function AddToSupabase(name: string, aspectRatio: number) {
    const { data, error } = await supabase.from("videos").insert([
      {
        id: generateUUID(),
        size: 25,
        url: `https://storage.googleapis.com/aspect-public-videos/${name}`,
        aspect_ratio: aspectRatio,
        position: videoLength,
        author: pathname.split("/")[1],
        added_at: new Date(),
      },
    ]);

    if (error) {
      console.error(error);
    } else {
      setIsUploading(false);
      addNewVideoToGrid();
    }
  }

  return (
    <>
      <label
        htmlFor="upload"
        className="fixed bottom-5 right-5 xl:bottom-10 xl:right-10 z-50 rounded-full border border-neutral-700 w-[58px] h-[58px] gap-2 px-2 hover:bg-neutral-600 transition-all duration-300 ease-in-out cursor-pointer aspect-square grid place-items-center group bg-black/10 backdrop-blur-sm hover:rotate-90 active:scale-[0.96]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        <input
          type="file"
          accept="video/*"
          className="hidden"
          id="upload"
          onChange={(e) => {
            if (e.target.files) {
              uploadVideo(e.target.files[0]);
            }
          }}
        />
      </label>
    </>
  );
}
