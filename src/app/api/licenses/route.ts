import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const licenses = await prisma.licenca.findMany();

  if (licenses.length === 0) {
    return NextResponse.json({ message: "No licenses found" }, { status: 404 });
  }

  return NextResponse.json(licenses, { status: 200 });
}
