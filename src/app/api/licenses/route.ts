import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const licenses = await prisma.licenca.findMany();

  if (licenses.length === 0) {
    return NextResponse.json({ message: "No licenses found" }, { status: 404 });
  }

  return new NextResponse(JSON.stringify(licenses, null, 2), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { empresaId, numero, orgaoAmbiental, emissao, validade } = body;

  const company = await prisma.empresa.findUnique({
    where: { id: empresaId },
  });

  if (!company) {
    return NextResponse.json({ message: "Company not found" }, { status: 404 });
  }

  if (!empresaId || !numero || !orgaoAmbiental || !emissao || !validade) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const newLicense = await prisma.licenca.create({
    data: {
      empresaId,
      numero,
      orgaoAmbiental,
      emissao: new Date(emissao),
      validade: new Date(validade),
    },
  });

  return new NextResponse(JSON.stringify(newLicense, null, 2), {
    headers: { "Content-Type": "application/json" },
    status: 201,
  });
}