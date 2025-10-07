import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface Params {
  id: string;
}

export async function GET(_request: NextRequest, context: { params: Promise<Params> }) {
  const params = await context.params;
  const { id } = params;

  const company = await prisma.empresa.findUnique({
    where: { id: String(id) },
    include: { licencas: true },
  });

  if (!company) {
    return NextResponse.json({ message: "Company not found" }, { status: 404 });
  }

  return new NextResponse(JSON.stringify(company, null, 2), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}

export async function DELETE(_request: Request, context: { params: Promise<Params> }) {
  const { id } = await context.params;

  const existingCompany = await prisma.empresa.findUnique({
    where: { id: String(id) },
  });

  if (!existingCompany) {
    return NextResponse.json({ message: "Company not found" }, { status: 404 });
  }

  const company = await prisma.empresa.delete({
    where: { id: String(id) },
  });

  return new NextResponse(JSON.stringify(company, null, 2), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}

export async function PUT(request: NextRequest, context: { params: Promise<Params> }) {
  const { id } = await context.params;

  const existingCompany = await prisma.empresa.findUnique({
    where: { id: String(id) },
  });

  if (!existingCompany) {
    return NextResponse.json({ message: "Company not found" }, { status: 404 });
  }

  const data = await request.json();
  const { razaoSocial, cnpj, cep, cidade, estado, bairro, complemento } = data;

  if (!razaoSocial || !cnpj || !cep || !cidade || !estado || !bairro) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const company = await prisma.empresa.update({
    where: { id: String(id) },
    data: {
      razaoSocial,
      cnpj,
      cep,
      cidade,
      estado,
      bairro,
      complemento: complemento || null,
    },
  });

  return new NextResponse(JSON.stringify(company, null, 2), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}
