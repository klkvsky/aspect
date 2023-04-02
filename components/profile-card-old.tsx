"use client";

import Image from "next/image";

export default function ProfileCard(props: {
  name: string;
  verified: boolean;
  photo: string;
  views: number;
  followers: number;
  topViewed: number;
  updateAspectRatio: (aspectRatio: string) => void;
  inceaseSize: () => void;
  decreaseSize: () => void;
}) {
  const {
    name,
    verified,
    photo,
    views,
    followers,
    topViewed,
    updateAspectRatio,
    inceaseSize,
    decreaseSize,
  } = props;


  return (
    <div className="w-full h-full rounded-[14px] relative overflow-hidden flex flex-col justify-between items-center text-white pt-[10px] lg:pt-[20px] transition-all duration-300 ease-in-out group border border-[#696969]">
      {/*  */}
      <div
        className="absolute top-0 left-0 bg-black/20 w-full h-full z-10 rounded-[14px] overflow-hidden"
        data-atropos-offset="-1"
      />
      <Image
        src={photo}
        fill
        alt="Profile picture of Me"
        className="object-cover z-0 rounded-[16px] overflow-hidden relative transition-all ease-in-out "
        data-atropos-offset="-0.5"
        priority={true}
      />
      {/*  */}
      <div className="font-semibold text-xs lg:text-[16px] relative z-30 flex flex-row items-center gap-[5px] px-[8px] lg:px-[12px] py-[6px] lg:py-[8px] bg-black/50 backdrop-blur-[6px] rounded-[33px] border border-[#696969]">
        <span>{name}</span>
        {verified ? (
          <svg
            width="23"
            height="22"
            viewBox="0 0 23 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-[#1DA1F2] w-[14px] h-[14px] lg:w-[24px] lg:h-[24px]"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.38608 3.48242C8.77288 3.03621 9.25116 2.67846 9.78846 2.43346C10.3258 2.18846 10.9095 2.06194 11.5 2.0625C12.7439 2.0625 13.8586 2.6125 14.6139 3.48242C15.2031 3.44035 15.7943 3.52558 16.3476 3.73231C16.9009 3.93903 17.4032 4.26242 17.8204 4.6805C18.2383 5.09764 18.5616 5.5998 18.7683 6.1529C18.975 6.706 19.0604 7.2971 19.0185 7.88608C19.4645 8.27297 19.8221 8.75129 20.067 9.28858C20.3118 9.82587 20.4382 10.4096 20.4375 11C20.4381 11.5905 20.3115 12.1742 20.0665 12.7115C19.8215 13.2488 19.4638 13.7271 19.0176 14.1139C19.0595 14.7029 18.9741 15.294 18.7674 15.8471C18.5607 16.4002 18.2374 16.9024 17.8195 17.3195C17.4024 17.7374 16.9002 18.0607 16.3471 18.2674C15.794 18.4741 15.2029 18.5595 14.6139 18.5176C14.2271 18.9638 13.7488 19.3215 13.2115 19.5665C12.6742 19.8115 12.0905 19.9381 11.5 19.9375C10.9095 19.9381 10.3258 19.8115 9.78846 19.5665C9.25116 19.3215 8.77288 18.9638 8.38608 18.5176C7.79701 18.5598 7.20576 18.4747 6.65249 18.2681C6.09921 18.0616 5.59687 17.7383 5.17958 17.3204C4.76155 16.9032 4.4382 16.4009 4.23147 15.8476C4.02475 15.2943 3.93949 14.7031 3.9815 14.1139C3.53546 13.727 3.17788 13.2487 2.93304 12.7114C2.6882 12.1741 2.56182 11.5905 2.5625 11C2.5625 9.75609 3.1125 8.64142 3.98242 7.88608C3.94048 7.2971 4.02578 6.70598 4.2325 6.15287C4.43922 5.59976 4.76254 5.09761 5.1805 4.6805C5.5976 4.26254 6.09976 3.93923 6.65287 3.7325C7.20598 3.52578 7.79709 3.44049 8.38608 3.48242ZM14.8092 9.33717C14.8642 9.26388 14.904 9.18034 14.9262 9.09145C14.9485 9.00257 14.9527 8.91013 14.9387 8.81958C14.9248 8.72902 14.8928 8.64217 14.8448 8.56414C14.7968 8.48611 14.7336 8.41846 14.6591 8.36518C14.5845 8.3119 14.5001 8.27406 14.4107 8.25388C14.3213 8.2337 14.2288 8.23159 14.1386 8.24768C14.0484 8.26376 13.9623 8.29772 13.8854 8.34755C13.8085 8.39737 13.7424 8.46207 13.6908 8.53784L10.7245 12.6903L9.23583 11.2017C9.1055 11.0802 8.93313 11.0141 8.75502 11.0173C8.57691 11.0204 8.40697 11.0926 8.28101 11.2185C8.15505 11.3445 8.0829 11.5144 8.07975 11.6925C8.07661 11.8706 8.14273 12.043 8.26417 12.1733L10.3267 14.2358C10.3972 14.3064 10.4823 14.3607 10.576 14.395C10.6697 14.4293 10.7697 14.4429 10.8691 14.4347C10.9685 14.4265 11.065 14.3968 11.1518 14.3475C11.2386 14.2983 11.3136 14.2308 11.3717 14.1497L14.8092 9.33717Z"
              fill="#1DA1F2"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="fill-[#1DA1F2] w-[14px] h-[14px] lg:w-[24px] lg:h-[24px]"
          >
            <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"></path>
          </svg>
        )}
      </div>
      {/*  */}
      <div className="flex flex-row items-center w-full z-20 p-4 gap-2">
        <button
          className="grid place-items-center w-7 h-7 aspect-square rounded-full bg-black/50 backdrop-blur-md transition-all duration-300 ease-in-out cursor-pointer hover:!scale-[1.15]"
          onClick={() => {
            updateAspectRatio("9/16");
          }}
        >
          <div className="h-[14px] w-auto aspect-[9/16] border border-white rounded-[1px]" />
        </button>
        <button
          className="grid place-items-center w-7 h-7 aspect-square rounded-full bg-black/50 backdrop-blur-md transition-all duration-300 ease-in-out cursor-pointer hover:!scale-[1.15]"
          onClick={() => {
            updateAspectRatio("1/1");
          }}
        >
          <div className="w-[14px] h-auto aspect-square border border-white rounded-[2px]" />
        </button>
        <button
          className="grid place-items-center w-7 h-7 aspect-square rounded-full bg-black/50 backdrop-blur-md transition-all duration-300 ease-in-out cursor-pointer hover:!scale-[1.15]"
          onClick={() => {
            updateAspectRatio("4/3");
          }}
        >
          <div className="w-[14px] h-auto aspect-[4/3] border border-white rounded-[1px]" />
        </button>
        <button
          className="grid place-items-center w-7 h-7 aspect-square rounded-full bg-black/50 backdrop-blur-md transition-all duration-300 ease-in-out cursor-pointer hover:!scale-[1.15]"
          onClick={() => {
            updateAspectRatio("16/9");
          }}
        >
          <div className="w-[14px] h-auto aspect-video border border-white rounded-[1px]" />
        </button>
        <div className="flex-row items-center gap-2">
          <button
            className="grid place-items-center w-7 h-7 aspect-square rounded-full bg-black/50 backdrop-blur-md opacity-0 group-hover:opacity-50 transition-all duration-300 ease-in-out hover:!opacity-100 cursor-pointer hover:!scale-[1.15] border border-transparent hover:!border-[#363636]"
            onClick={() => {
              inceaseSize();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-[18px] h-[18px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
              />
            </svg>
          </button>
          <button
            className="grid place-items-center w-7 h-7 aspect-square rounded-full bg-black/50 backdrop-blur-md opacity-0 group-hover:opacity-50 transition-all duration-300 ease-in-out hover:!opacity-100 cursor-pointer hover:!scale-[1.15] border border-transparent hover:!border-[#363636]"
            onClick={() => {
              props.decreaseSize();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-[18px] h-[18px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
              />
            </svg>
          </button>
        </div>
      </div>
      {/*  */}
      {/* <div className="w-full h-[60px] lg:h-[92px] border-t border-[#696969] flex flex-row items-center justify-center gap-[30px] lg:gap-[60px] px-[10px] lg:px-[20px] relative z-20 bg-black/50 backdrop-blur-md rounded-b-[14px] group-hover:h-[70px] lg:group-hover:h-[110px] transition-all duration-500 ease-in-out">
                <div className="flex flex-col items-center text-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 lg:w-5 lg:h-5 opacity-80"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"
                      clipRule="evenodd"
                    />
                    <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                  </svg>

                  <span className="max-h-0 opacity-0 overflow-clip group-hover:max-h-[2ch] group-hover:opacity-100 transition-all duration-500 ease-in-out scale-[0.8] group-hover:scale-100 text-[10px] lg:text-base lg:group-hover:mb-1">
                    Followers
                  </span>
                  <span className="font-bold text-xs lg:text-[20px]">
                    {followers}
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 lg:w-5 lg:h-5 opacity-80"
                  >
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    <path
                      fillRule="evenodd"
                      d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="max-h-0 opacity-0 overflow-clip group-hover:max-h-[2ch] group-hover:opacity-100 transition-all duration-500 ease-in-out scale-[0.8] group-hover:scale-100 text-[10px] lg:text-base lg:group-hover:mb-1">
                    Views
                  </span>
                  <span className="font-bold text-xs lg:text-[20px]">
                    {views}K
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 lg:w-5 lg:h-5 opacity-80"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span className="max-h-0 opacity-0 overflow-clip group-hover:max-h-[2ch] group-hover:opacity-100 transition-all duration-500 ease-in-out scale-[0.8] group-hover:scale-100 text-[10px] lg:text-base  lg:group-hover:mb-1">
                    Top video
                  </span>

                  <span className="font-bold text-xs lg:text-[20px]">
                    {topViewed}K
                  </span>
                </div>
              </div> */}
    </div>
  );
}
