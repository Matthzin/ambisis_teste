import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  id: string;
}

export async function GET(_request: Request, { params }: { params: Params }) {
  const { id } = params;
  const license = await prisma.licenca.findUnique({
    where: { id: String(id) },
  });
  return NextResponse.json(license);
}
