"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "../components/Modal";

interface License {
  id: string;
  numero: string;
  orgaoAmbiental: string;
  emissao: string;
  validade: string;
}

interface Company {
  id: string;
  razaoSocial: string;
  cnpj: string;
  cep: string;
  cidade: string;
  estado: string;
  bairro: string;
  complemento?: string;
  licencas?: License[];
}

export default function Home() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "empresa" | "licenca";
    id: string | string;
  } | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/companies");
        const data = await res.json();

        if (Array.isArray(data)) {
          setCompanies(data);
        } else if (data && Array.isArray(data.empresas)) {
          setCompanies(data.empresas);
        } else {
          setCompanies([]);
        }
      } catch (error) {
        console.error("Erro ao carregar empresas:", error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const confirmDelete = (type: "empresa" | "licenca", id: string | string) => {
    setItemToDelete({ type, id });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === "empresa") {
        await fetch(`/api/companies/${itemToDelete.id}`, { method: "DELETE" });
        setCompanies((prev) => prev.filter((c) => c.id !== itemToDelete.id));
      } else {
        await fetch(`/api/licenses/${itemToDelete.id}`, { method: "DELETE" });
        setCompanies((prev) =>
          prev.map((company) => ({
            ...company,
            licencas: company.licencas?.filter((l) => l.id !== itemToDelete.id),
          }))
        );
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
    } finally {
      setModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Empresas Cadastradas
        </h1>
        <button
          onClick={() => router.push("/company/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Nova Empresa
        </button>
      </div>

      {loading ? (
        <p>Carregando empresas...</p>
      ) : Array.isArray(companies) && companies.length > 0 ? (
        <div className="w-full max-w-3xl flex flex-col gap-4">
          {companies.map((empresa) => {
            const isExpanded = expandedId === empresa.id;

            return (
              <div
                key={empresa.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition"
              >
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpand(empresa.id)}
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {empresa.razaoSocial}
                    </p>
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>CNPJ: </strong>
                      <span>{empresa.cnpj}</span>
                    </p>
                    <div className="flex text-sm text-gray-700">
                      <p className="text-gray-600 text-sm mb-1">
                        <strong>Cidade/UF: </strong>
                        <span>{empresa.cidade}</span>
                        <span> | </span>
                        <span>{empresa.estado}</span>
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-3 h-3 border-b-2 border-r-2 border-gray-500 transform transition-transform ${
                      isExpanded ? "rotate-45 mt-1" : "-rotate-135 -mt-1"
                    }`}
                  ></div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4  border-gray-100 text-sm text-gray-700 space-y-2">
                    <p>
                      <strong>CEP: </strong>
                      <span>{empresa.cep}</span>
                    </p>
                    <p>
                      <strong>Bairro: </strong>
                      <span>{empresa.bairro}</span>
                    </p>
                    {empresa.complemento && (
                      <p>
                        <strong>Complemento:</strong>{" "}
                        <span>{empresa.complemento}</span>
                      </p>
                    )}

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() =>
                          router.push(`/company/edit/${empresa.id}`)
                        }
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete("empresa", empresa.id);
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Excluir
                      </button>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-gray-800">
                          Licenças Ambientais:
                        </p>
                        <button
                          onClick={() =>
                            router.push(`/license/new?empresaId=${empresa.id}`)
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                        >
                          Nova Licença
                        </button>
                      </div>

                      {empresa.licencas && empresa.licencas.length > 0 ? (
                        <div className="space-y-3">
                          {empresa.licencas.map((license) => (
                            <div
                              key={license.id}
                              className="border rounded-lg p-3 bg-gray-50"
                            >
                              <p>
                                <strong>Número: </strong>
                                <span>{license.numero}</span>
                              </p>
                              <p>
                                <strong>Órgão Ambiental: </strong>
                                <span>{license.orgaoAmbiental}</span>
                              </p>
                              <p>
                                <strong>Data de Emissão: </strong>
                                <span>
                                  {new Date(license.emissao).toLocaleDateString(
                                    "pt-BR",
                                    { timeZone: "UTC" }
                                  )}
                                </span>
                              </p>
                              <p>
                                <strong>Data de Validade: </strong>
                                <span>
                                  {new Date(
                                    license.validade
                                  ).toLocaleDateString("pt-BR", {
                                    timeZone: "UTC",
                                  })}
                                </span>
                              </p>

                              <div className="flex gap-3 mt-2">
                                <button
                                  onClick={() =>
                                    router.push(`/license/edit/${license.id}`)
                                  }
                                  className="text-blue-600 hover:underline text-sm"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() =>
                                    confirmDelete("licenca", license.id)
                                  }
                                  className="text-red-600 hover:underline text-sm"
                                >
                                  Excluir
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">
                          Nenhuma licença cadastrada.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 italic">
          Nenhuma empresa cadastrada ainda.
        </p>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-4">
          <p className="text-lg text-center">
            Tem certeza que deseja excluir esta{" "}
            <strong>
              {itemToDelete?.type === "empresa" ? "empresa" : "licença"}
            </strong>
            ?
          </p>
          <div className="flex justify-center mt-4 gap-4">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Excluir
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
