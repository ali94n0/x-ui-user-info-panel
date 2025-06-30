import { NextResponse } from "next/server";

export async function POST(req) {
  const { server, email } = await req.json();

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
    // استخراج کوکی از Header
    const cookies = loginResponse1.headers.get("set-cookie");

    if (!loginResponse1.ok) {
      const loginResponse2 = await fetch(`${url2}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      // استخراج کوکی از Header
      const cookies = loginResponse2.headers.get("set-cookie");
      if (!loginResponse2.ok) {
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
    response.headers.set("Set-Cookie", cookies.split(",")[1]); // ذخیره کوکی در مرورگر

    // ارسال درخواست برای دریافت اطلاعات کاربر
    const userResponse = await fetch(
      `${
        loginResponse1.ok ? url1 : url2
      }/panel/api/inbounds/getClientTraffics/${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookies.split(",")[1], // ارسال کوکی برای احراز هویت
        },
      }
    );

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "User data retrieval failed" },
        { status: 500 }
      );
    }

    const userData = await userResponse.json();

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
