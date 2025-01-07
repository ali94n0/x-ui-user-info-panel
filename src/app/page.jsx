"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Home() {
	const [server, setServer] = useState(null);
	const [email, setEmail] = useState("");
	const [loading,setLoading] = useState(false)
	const router = useRouter();


	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true)
		try {
			// ارسال اطلاعات به API سرور
			const response = await fetch("/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ server, email }),
			});

			if (response.ok) {
				setLoading(false)
				const data = await response.json();
				router.push(`/result?total=${data.total}&upload=${data.upload}&download=${data.download}&expireTime=${new Date(data.expireTime).toLocaleDateString("fa-ir")}&status=${data.status}&userId=${data.userId}`);
				
			} else {
				toast.error("به پشتیبانی پیام دهید");
				setLoading(false)
			}
		} catch (error) {
			toast.error(error?.message)
			setLoading(false)
		}
	};

	return (
		<div className="container max-w-screen-sm bg-secondary-100 min-h-[calc(100vh-10rem)]">
			<div className="flex justify-center w-full items-center">
				<div className="flex flex-col w-full p-2 gap-y-4">
					<h1 className=" p-2 mt-8 text-secondary-800 text-xl font-bold">سرور خود را انتخاب کنید.</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
				<div className="flex gap-x-8 p-2 ">
					<label className="flex gap-x-2 items-center flex-1 border border-secondary-500 rounded-lg p-4 shadow-md shadow-secondary-300 text-secondary-700 font-bold">
						<input
							type="radio"
							value="finland"
							checked={server === "finland"}
							onChange={() => setServer("finland")}
						/>
						Vip1 - فنلاند 🇫🇮
					</label>
					<label className="flex gap-x-2 items-center flex-1 border border-secondary-500 rounded-lg p-4 shadow-md shadow-secondary-300 text-secondary-700 font-bold">
						<input
							type="radio"
							value="germany"
							checked={server === "germany"}
							onChange={() => setServer("germany")}
						/>
						Vip7 - المان 🇩🇪
					</label>
				</div>
				<div className="flex w-full flex-col gap-y-4 mt-4 p-2">
					<input
						type="text"
						placeholder="کد اشتراک ۴ رقمی خود را وارد کنید..."
						value={email}
						onChange={(e) => setEmail(e.target.value)}
								required
								className="p-3 rounded-lg text-secondary-100 "
					/>
				{loading ? <p className="text-md text-secondary-600 flex justify-center">در حال دریافت اطلاعات ...</p> : <button className="w-full rounded-lg bg-primary-800 text-white text-xl font-bold p-2" type="submit" disabled={!email}>دریافت اطلاعات</button>}
				</div>
			</form></div>
			</div>
		</div>
	);
}
