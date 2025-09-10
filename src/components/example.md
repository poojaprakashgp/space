// pages/api/get-ip.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip =
    typeof forwarded === 'string'
      ? forwarded.split(',')[0]
      : req.socket?.remoteAddress;

  res.status(200).json({ ip });
}


// app/api/get-ip/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0] || req.ip || 'Unknown IP';

  return NextResponse.json({ ip });
}

'use client';

import { useEffect, useState } from 'react';

const GetUserIP = () => {
  const [ip, setIP] = useState('');

  useEffect(() => {
    const fetchIP = async () => {
      const res = await fetch('/api/get-ip');
      const data = await res.json();
      setIP(data.ip);
    };

    fetchIP();
  }, []);

  return (
    <div>
      <h2>Your IP Address:</h2>
      <p>{ip || 'Loading...'}</p>
    </div>
  );
};

export default GetUserIP;

Issue with Funding Source API – Billing Address Not Verified
We are facing an issue with the Funding Source API where, even with proper and valid details, we are inconsistently receiving the error message: “Billing address was not verified.”
This occurs intermittently, and we have not been able to identify the root cause from our end despite multiple checks. Could you please help us investigate this issue and advise on possible reasons or steps to resolve it?
Looking forward to your guidance.
