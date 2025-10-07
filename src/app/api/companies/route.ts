import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const companies = await prisma.empresa.findMany({
    include: { licencas: true },
  });

  if (companies.length === 0) {
    return NextResponse.json(
      { message: "No companies found" },
      { status: 404 }
    );
  }

  return new NextResponse(JSON.stringify(companies, null, 2), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { razaoSocial, cnpj, cep, cidade, estado, bairro, complemento } = body;

  if (!razaoSocial || !cnpj || !cep || !cidade || !estado || !bairro) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  if (!cnpjRegex.test(cnpj)) {
    return NextResponse.json(
      { message: "CNPJ is not valid" },
      { status: 400 }
    );
  }

  const newCompany = await prisma.empresa.create({
    data: {
      razaoSocial,
      cnpj,
      cep,
      cidade,
      estado,
      bairro,
      complemento: complemento || null,
    },
    include: { licencas: true },
  });

  return new NextResponse(JSON.stringify(newCompany, null, 2), {
    headers: { "Content-Type": "application/json" },
    status: 201,
  });
}
