import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  id: string;
}

export async function GET(_request: Request, { params }: { params: Params }) {
  const { id } = params;
  const company = await prisma.empresa.findUnique({
    where: { id: String(id) },
    include: { licencas: true },
  });
  return NextResponse.json(company);
}
