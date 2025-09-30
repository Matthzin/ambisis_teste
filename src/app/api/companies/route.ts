import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_request: Request) {
  const companies = await prisma.empresa.findMany({
    include: { licencas: true },
  });
  return NextResponse.json(companies);
}
