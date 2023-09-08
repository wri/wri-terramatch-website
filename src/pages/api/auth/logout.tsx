import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.send("only POST");

  res.setHeader("Set-Cookie", "accessToken=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT");

  res.status(200).json({ success: true });
}
