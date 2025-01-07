import { NextResponse } from "next/server";

export async function POST(req) {
	const { server, email } = await req.json();

	// اطلاعات سرورهای مختلف
	const serverCredentials = {
		germany: {
			username: "ali94n0",
			password: "008110ali",
			url: "http://vip7-tu1.servicedeutsch.com:2096",
		},
		finland: {
			username: "ali94n0",
			password: "008110ali",
			url: "http://vip1-tu1.servicedeutsch.com:2096",
		},
	};

	const { username, password, url } = serverCredentials[server];

	try {
		// ارسال درخواست لاگین به سرور
		const loginResponse = await fetch(`${url}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password }),
		});

		if (!loginResponse.ok) {
			return NextResponse.json({ error: "Login failed" }, { status: 500 });
		}

		// استخراج کوکی از Header
		const cookies = loginResponse.headers.get("set-cookie");

		if (!cookies) {
			return NextResponse.json(
				{ error: "No cookie received" },
				{ status: 500 },
			);
		}

		// ارسال کوکی به مرورگر
		const response = NextResponse.json({ message: "Login successful" });
		response.headers.set("Set-Cookie", cookies.split(",")[1]); // ذخیره کوکی در مرورگر

		// ارسال درخواست برای دریافت اطلاعات کاربر
		const userResponse = await fetch(
			`${url}/panel/api/inbounds/getClientTraffics/${email}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookies.split(",")[1], // ارسال کوکی برای احراز هویت
				},
			},
		);

		if (!userResponse.ok) {
			return NextResponse.json(
				{ error: "User data retrieval failed" },
				{ status: 500 },
			);
		}

		const userData = await userResponse.json();

		// تبدیل داده‌ها به فرمت مناسب
		const upload = parseFloat(userData.obj.up || 0);
		const download = parseFloat(userData.obj.down || 0);
		const total = parseFloat(userData.obj.total || 0);
		const expireTime = userData.obj.expiryTime || 0;
		const status = userData.obj.enable || "Unknown";
		const userId = userData.obj.email || "Unknown";

		return NextResponse.json({
			total,
			upload,
			download,
			expireTime,
			status,
			userId,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 },
		);
	}
}
