"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "@/components/Modal";

interface Company {
  id: string;
  razaoSocial: string;
  cnpj: string;
}

interface LicenseForm {
  empresaId: string;
  numero: string;
  orgaoAmbiental: string;
  emissao: string;
  validade: string;
}

export default function NewLicense() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultCompanyId = searchParams.get("empresaId") || "";

  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState<LicenseForm>({
    empresaId: "",
    numero: "",
    orgaoAmbiental: "",
    emissao: "",
    validade: "",
  });

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/companies");
        const data = await res.json();
        setCompanies(data);

        if (defaultCompanyId) {
          setForm((prev) => ({ ...prev, empresaId: defaultCompanyId }));
        } else if (data.length > 0) {
          setForm((prev) => ({ ...prev, empresaId: data[0].id }));
        }
      } catch (error) {
        console.error("Erro ao carregar empresas:", error);
        setMessage("Erro ao carregar empresas.");
        setMessageModalOpen(true);
      }
    }
    fetchCompanies();
  }, [defaultCompanyId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmModalOpen(true);
  };

  const confirmAdd = async () => {
    try {
      const res = await fetch("/api/licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage("Licença cadastrada com sucesso!");
      } else {
        const error = await res.json();
        setMessage(`Erro: ${error.message}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("Erro ao cadastrar licença.");
    } finally {
      setConfirmModalOpen(false);
      setMessageModalOpen(true);
    }
  };

  const closeMessageModal = () => {
    setMessageModalOpen(false);
    if (message === "Licença cadastrada com sucesso!") {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center p-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Cadastro de Licença</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="flex flex-col">
          <label className="font-medium mb-1">Empresa</label>
          <select
            name="empresaId"
            value={form.empresaId}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
          >
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.cnpj} | {company.razaoSocial}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1">Número</label>
          <input
            type="text"
            name="numero"
            value={form.numero}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            maxLength={255}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1">Órgão Ambiental</label>
          <input
            type="text"
            name="orgaoAmbiental"
            value={form.orgaoAmbiental}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            maxLength={255}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1">Emissão</label>
          <input
            type="date"
            name="emissao"
            value={form.emissao}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1">Validade</label>
          <input
            type="date"
            name="validade"
            value={form.validade}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            min={form.emissao}
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Cadastrar Licença
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
        </div>
      </form>

      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
      >
        <div className="p-4">
          <p className="text-lg mb-4 text-center">
            Confirma o cadastro desta licença?
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setConfirmModalOpen(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              onClick={confirmAdd}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={messageModalOpen} onClose={closeMessageModal}>
        <div className="p-4">
          <p className="text-lg text-center">{message}</p>
          <div className="flex justify-center mt-4">
            <button
              onClick={closeMessageModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
