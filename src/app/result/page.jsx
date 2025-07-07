"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const upload = (searchParams.get("upload") / 1024 ** 3).toFixed(2); // تبدیل به GiB
  const download = (searchParams.get("download") / 1024 ** 3).toFixed(2); // تبدیل به GiB
  const total = (parseFloat(upload) + parseFloat(download)).toFixed(2);
  const expireTime = searchParams.get("expireTime");
  const status = searchParams.get("status");
  const userId = searchParams.get("userId");
  const totalLimit = (searchParams.get("total") / 1024 ** 3).toFixed(2);
  const router = useRouter();

  const statusObj = {
    true: { label: "فعال", costomClass: "bg-success" },
    false: { label: "غیرفعال", costomClass: "bg-error" },
    Unknown: { label: "نامشخص", costomClass: "bg-warning" },
  };

  useEffect(() => {
    if (status === "false") {
      toast.error("😢 ما دلمون برات تنگ شده! بیا پیشمون و اکانتو تمدید کن 🌈");
    } else {
      toast.success("🎉 همه چی مرتبه! فعلاً فقط لذت ببر ✌️");
    }
  }, [status]);

  return (
    <div className="container max-w-screen-sm bg-secondary-100 min-h-[calc(100vh-10rem)]">
      <div className="flex flex-col justify-center w-full items-center">
        <div className="w-full flex items-center justify-start p-2">
          <button
            onClick={() => router.push("/")}
            className="py-2 px-4 text-error rounded-md border border-error flex items-center gap-x-2"
          >
            <IoMdArrowRoundBack className="stroke-error w-5 h-5 rotate-180" />
            بازگشت
          </button>
        </div>
        <div className="mt-4 w-full p-4 flex flex-col gap-y-2">
          <h1 className="text-secondary-800 text-xl font-bold mb-2">
            اطلاعات کاربر
          </h1>
          <p className=" border border-secondary-400 rounded-lg shadow-md shadow-secondary-300 p-2 text-secondary-600 text-md ">
            کد اشتراک: {userId}
          </p>
          <p className=" border border-secondary-400 rounded-lg shadow-md shadow-secondary-300 p-2 text-secondary-600 text-md ">
            وضعیت:{" "}
            <span
              className={`rounded-xl px-2 py-0.5 text-white ${statusObj[status].costomClass}`}
            >
              {statusObj[status].label}
            </span>
          </p>
          <p className=" border border-secondary-400 rounded-lg shadow-md shadow-secondary-300 p-2 text-secondary-600 text-md ">
            حجم اپلود: {upload} GB
          </p>
          <p className=" border border-secondary-400 rounded-lg shadow-md shadow-secondary-300 p-2 text-secondary-600 text-md ">
            حجم دانلود: {download} GB
          </p>
          <p className=" border border-secondary-400 rounded-lg shadow-md shadow-secondary-300 p-2 text-error/80 text-md ">
            حجم کل مصرف شده: {total} GB
          </p>
          <p className=" border border-secondary-400 rounded-lg shadow-md shadow-secondary-300 p-2 text-warning/80 text-md ">
            حجم کل اشتراک: {totalLimit} GB
          </p>
          <p className=" border border-secondary-400 rounded-lg shadow-md shadow-secondary-300 p-2 text-success/80 text-md ">
            حجم باقیمانده: {(totalLimit - total).toFixed(2)} GB
          </p>
          <p className=" border border-secondary-400 rounded-lg shadow-md shadow-secondary-300 p-2 text-primary-800 text-md ">
            تاریخ انقضا: {expireTime}
          </p>
        </div>
      </div>
    </div>
  );
}
