import Image from "next/image";

import {
  CheckBadgeIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/solid";

export default function ProfileCard(props: {
  photo: string;
  username: string;
  updateAspectRatio: (aspectRatio: string) => void;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  const { photo, username, updateAspectRatio, onDecrease, onIncrease } = props;

  return (
    <div className="relative w-full h-full border border-neutral-700 rounded-[14px] overflow-hidden flex flex-col justify-between p-2 group">
      <div className="flex flex-row items-center gap-1 z-10 relative bg-black/50 px-2.5 py-1 rounded-full border border-neutral-600 w-fit mx-auto backdrop-blur-md">
        <span className="font-medium">{username}</span>
        <CheckBadgeIcon className="w-[20px] h-[20px] text-[#1DA1F2]" />
      </div>
      <div className="flex flex-row items-center justify-between relative z-20">
        <div className="flex flex-row items-center gap-2">
          <button
            className="w-[26px] h-[26px] aspect-square rounded-full bg-neutral-950/50 backdrop-blur-sm border border-neutral-700 hover:border-opacity-50 p-1.5 hover:!scale-[1.04] active:!scale-[0.96] opacity-0 group-hover:opacity-100 grid place-items-center transition-all ease-in-out"
            onClick={() => {
              onIncrease();
            }}
          >
            <ArrowsPointingOutIcon className="w-full h-auto aspect-square text-white transition-all ease-in-out scale-75 group-hover:scale-100 duration-200" />
          </button>

          <button
            className="w-[26px] h-[26px] aspect-square rounded-full bg-neutral-950/50 backdrop-blur-sm border border-neutral-700 hover:border-opacity-50 p-1.5 hover:!scale-[1.04] active:!scale-[0.96] opacity-0 group-hover:opacity-100 grid place-items-center transition-all ease-in-out"
            onClick={() => {
              onDecrease();
            }}
          >
            <ArrowsPointingInIcon className="w-full h-auto aspect-square text-white transition-all ease-in-out scale-75 group-hover:scale-100 duration-200" />
          </button>
        </div>

        <div className="flex flex-row-reverse items-center gap-2">
          <button
            className="grid place-items-center w-[26px] h-[26px] aspect-square rounded-full bg-black/50 backdrop-blur-md transition-all duration-300 ease-in-out cursor-pointer hover:!scale-[1.15] opacity-0 group-hover:opacity-100"
            onClick={() => {
              updateAspectRatio("9/16");
            }}
          >
            <div className="h-[14px] w-auto aspect-[9/16] border border-white rounded-[1px]" />
          </button>
          <button
            className="grid place-items-center w-[26px] h-[26px] aspect-square rounded-full bg-black/50 backdrop-blur-md transition-all duration-300 ease-in-out cursor-pointer hover:!scale-[1.15] opacity-0 group-hover:opacity-100"
            onClick={() => {
              updateAspectRatio("1/1");
            }}
          >
            <div className="w-[14px] h-auto aspect-square border border-white rounded-[2px]" />
          </button>
          <button
            className="grid place-items-center w-[26px] h-[26px] aspect-square rounded-full bg-black/50 backdrop-blur-md transition-all duration-300 ease-in-out cursor-pointer hover:!scale-[1.15] opacity-0 group-hover:opacity-100"
            onClick={() => {
              updateAspectRatio("4/3");
            }}
          >
            <div className="w-[14px] h-auto aspect-[4/3] border border-white rounded-[1px]" />
          </button>
          <button
            className="grid place-items-center w-[26px] h-[26px] aspect-square rounded-full bg-black/50 backdrop-blur-md transition-all duration-300 ease-in-out cursor-pointer hover:!scale-[1.15] opacity-0 group-hover:opacity-100"
            onClick={() => {
              updateAspectRatio("16/9");
            }}
          >
            <div className="w-[14px] h-auto aspect-video border border-white rounded-[1px]" />
          </button>
        </div>
      </div>
      <Image
        src={photo}
        fill
        alt="Profile picture of Me"
        className="object-cover z-0 relative transition-all ease-in-out"
        priority={true}
      />
    </div>
  );
}
