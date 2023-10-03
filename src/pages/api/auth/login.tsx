import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.send("only POST");

  const token = req.body.token;

  setCookie({ res }, "accessToken", token, {
    maxAge: 60 * 60 * 12, // 12 hours
    // httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    path: "/"
  });

  res.status(200).json({ success: true });
}
