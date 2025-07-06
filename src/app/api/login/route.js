import { NextResponse } from "next/server";

export async function POST(req) {
  const { server, email } = await req.json();
  let cookies = "";

  // اطلاعات سرورهای مختلف
  const serverCredentials = {
    vip7: {
      username: "ali94n0",
      password: "008110ali",
      url1: "http://vip7-tu.sitetbama.com:2096",
      url2: "http://vip7-lb.sitetbama.com:2096",
    },
    vip1: {
      username: "ali94n0",
      password: "008110ali",
      url1: "http://vip1-tu.sitetbama.com:2096",
      url2: "http://vip1-lb.sitetbama.com:2096",
    },
    vip10: {
      username: "ali94n0",
      password: "008110ali",
      url1: "http://vip10-tu.sitetbama.com:2096",
      url2: "http://vip10-lb.sitetbama.com:2096",
    },
  };

  const { username, password, url1, url2 } = serverCredentials[server];

  try {
    // ارسال درخواست لاگین به سرور
    const loginResponse1 = await fetch(`${url1}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data1 = await loginResponse1.json();

    // استخراج کوکی از Header
    cookies = loginResponse1.headers.get("set-cookie");

    if (!data1.success) {
      const loginResponse2 = await fetch(`${url2}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data2 = await loginResponse2.json();

      // استخراج کوکی از Header
      cookies = loginResponse2.headers.get("set-cookie");

      if (!data2.success) {
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
      }
    }

    if (!cookies) {
      return NextResponse.json(
        { error: "No cookie received" },
        { status: 500 }
      );
    }

    // ارسال کوکی به مرورگر
    const response = NextResponse.json({ message: "Login successful" });
    const newCookie = cookies
      .split(",") // تقسیم بر اساس کوکی‌ها
      .map((s) => s.trim()) // حذف فاصله اضافی
      .filter((s) => s.startsWith("3x-ui=")) // فقط کوکی‌های 3x-ui
      .map((s) => s.split(";")[0]) // فقط قسمت 3x-ui=... را نگه‌دار
      .pop(); // آخرین مقدار را بگیر

    response.headers.set("Set-Cookie", newCookie); // ذخیره کوکی در مرورگر

    // ارسال درخواست برای دریافت اطلاعات کاربر
    const path = `${
      data1.success ? url1 : url2
    }/panel/api/inbounds/getClientTraffics/${email}`;

    const userResponse = await fetch(path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: newCookie, // ارسال کوکی برای احراز هویت
      },
    });
    const userData = await userResponse.json();
    console.log(userData);

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "User data retrieval failed" },
        { status: 500 }
      );
    }

    // تبدیل داده‌ها به فرمت مناسب
    const upload = parseFloat(userData.obj.up || 0);
    const download = parseFloat(userData.obj.down || 0);
    const total = parseFloat(userData.obj.total || 0);
    const expireTime = userData.obj.expiryTime || 0;
    const status = userData.obj?.enable;
    const userId = userData.obj?.email;

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
      { status: 500 }
    );
  }
}
