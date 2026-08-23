import { NextResponse } from "next/server";

const MOCK_PLANS_DATABASE = {
  mtn: [
    {
      id: "mtn-100mb",
      name: "100MB SME Data",
      size: "100 MB",
      validity: "24 Hours",
      price: 100,
      network: "mtn",
    },
    {
      id: "mtn-200mb",
      name: "200MB SME Data",
      size: "200 MB",
      validity: "3 Days",
      price: 200,
      network: "mtn",
    },
    {
      id: "mtn-500mb",
      name: "500MB SME Data",
      size: "500 MB",
      validity: "30 Days",
      price: 150,
      network: "mtn",
    },
    {
      id: "mtn-1gb",
      name: "1.0 GB SME Data",
      size: "1.0 GB",
      validity: "30 Days",
      price: 270,
      network: "mtn",
    },
    {
      id: "mtn-2gb",
      name: "2.0 GB SME Data",
      size: "2.0 GB",
      validity: "30 Days",
      price: 520,
      network: "mtn",
    },
    {
      id: "mtn-3gb",
      name: "3.0 GB SME Data",
      size: "3.0 GB",
      validity: "30 Days",
      price: 780,
      network: "mtn",
    },
    {
      id: "mtn-5gb",
      name: "5.0 GB SME Data",
      size: "5.0 GB",
      validity: "30 Days",
      price: 1300,
      network: "mtn",
    },
    {
      id: "mtn-10gb",
      name: "10.0 GB MEGA Data",
      size: "10.0 GB Mega Data",
      validity: "30 Days",
      price: 2550,
      network: "mtn",
    },
  ],
  airtel: [
    {
      id: "airtel-100mb",
      name: "100MB Data",
      size: "100 MB",
      validity: "24 Hours",
      price: 100,
      network: "airtel",
    },
    {
      id: "airtel-300mb",
      name: "300MB Data",
      size: "300 MB",
      validity: "7 Days",
      price: 300,
      network: "airtel",
    },
    {
      id: "airtel-500mb",
      name: "500MB Data",
      size: "500 MB",
      validity: "30 Days",
      price: 160,
      network: "airtel",
    },
    {
      id: "airtel-1gb",
      name: "1.0 GB Data",
      size: "1.0 GB",
      validity: "30 Days",
      price: 280,
      network: "airtel",
    },
    {
      id: "airtel-2gb",
      name: "2.0 GB Data",
      size: "2.0 GB",
      validity: "30 Days",
      price: 540,
      network: "airtel",
    },
    {
      id: "airtel-5gb",
      name: "5.0 GB Data",
      size: "5.0 GB",
      validity: "30 Days",
      price: 1350,
      network: "airtel",
    },
  ],
  glo: [
    {
      id: "glo-200mb",
      name: "200MB Data",
      size: "200 MB",
      validity: "4 Days",
      price: 105,
      network: "glo",
    },
    {
      id: "glo-500mb",
      name: "500MB Data",
      size: "500 MB",
      validity: "30 Days",
      price: 150,
      network: "glo",
    },
    {
      id: "glo-1gb",
      name: "1.0 GB Data",
      size: "1.0 GB",
      validity: "30 Days",
      price: 290,
      network: "glo",
    },
    {
      id: "glo-2gb",
      name: "2.0 GB Data",
      size: "2.0 GB",
      validity: "30 Days",
      price: 580,
      network: "glo",
    },
    {
      id: "glo-5gb",
      name: "5.0 GB Data",
      size: "5.0 GB",
      validity: "30 Days",
      price: 1400,
      network: "glo",
    },
  ],
  "9mobile": [
    {
      id: "9mob-100mb",
      name: "100MB Data",
      size: "100 MB",
      validity: "24 Hours",
      price: 100,
      network: "9mobile",
    },
    {
      id: "9mob-1gb",
      name: "1.0 GB Data",
      size: "1.0 GB",
      validity: "30 Days",
      price: 300,
      network: "9mobile",
    },
    {
      id: "9mobile-2gb",
      name: "2.0 GB Data",
      size: "2.0 GB",
      validity: "30 Days",
      price: 600,
      network: "9mobile",
    },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const network = searchParams.get("network")?.toLowerCase();

  if (network && network in MOCK_PLANS_DATABASE) {
    return NextResponse.json({
      status: true,
      message: "Plans fetched successfully (Mock Mode)",
      data: MOCK_PLANS_DATABASE[network as keyof typeof MOCK_PLANS_DATABASE],
    });
  }

  const allPlans = Object.values(MOCK_PLANS_DATABASE).flat();
  return NextResponse.json({
    status: true,
    message: "All plans fetched successfully (Mock Mode)",
    data: allPlans,
  });
}
