import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_request: Request) {
  const licenses = await prisma.licenca.findMany();
  return NextResponse.json(licenses);
}
