import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  id: string;
}

export async function GET(_request: NextRequest, context: { params: Promise<Params> }) {
  const params = await context.params;
  const { id } = params;
  const license = await prisma.licenca.findUnique({
    where: { id: String(id) },
  });

  if (!license) {
    return NextResponse.json({ message: "Licença não encontrada" }, { status: 404 });
  }

  return NextResponse.json(license, { status: 200 });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<Params> }) {
  const { id } = await context.params;

  const existingLicense = await prisma.licenca.findUnique({
    where: { id: String(id) },
  });

  if (!existingLicense) {
    return NextResponse.json({ message: "Licença não encontrada" }, { status: 404 });
  }

  const license = await prisma.licenca.delete({
    where: { id: String(id) },
  });

  return new NextResponse(JSON.stringify(license, null, 2), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}

export async function PUT(request: NextRequest, context: { params: Promise<Params> }) {
  const { id } = await context.params;

  const existingLicense = await prisma.licenca.findUnique({
    where: { id: String(id) },
  });
  
  if (!existingLicense) {
    return NextResponse.json({ message: "Licença não encontrada" }, { status: 404 });
  }
  
  const data = await request.json();
  const { numero, orgaoAmbiental, emissao, validade } = data;

  if (!numero || !orgaoAmbiental || !emissao || !validade) {
    return NextResponse.json(
      { message: "Preencha todos os campos obrigatórios" },
      { status: 400 }
    );
  }

  const license = await prisma.licenca.update({
    where: { id: String(id) },
    data: {
      numero,
      orgaoAmbiental,
      emissao: new Date(emissao),
      validade: new Date(validade),
    },
  });

  return new NextResponse(JSON.stringify(license, null, 2), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}