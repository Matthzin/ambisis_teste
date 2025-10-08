"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";

interface CompanyForm {
  razaoSocial: string;
  cnpj: string;
  cep: string;
  cidade: string;
  estado: string;
  bairro: string;
  complemento: string;
}

export default function NewCompany() {
  const router = useRouter();
  const [form, setForm] = useState<CompanyForm>({
    razaoSocial: "",
    cnpj: "",
    cep: "",
    cidade: "",
    estado: "",
    bairro: "",
    complemento: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
    setForm({ ...form, cnpj: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMessage("Empresa cadastrada com sucesso!");
      setConfirmModalOpen(true);
      setForm({
        razaoSocial: "",
        cnpj: "",
        cep: "",
        cidade: "",
        estado: "",
        bairro: "",
        complemento: "",
      });
    } else {
      const error = await res.json();
      setMessage(`Erro: ${error.message}`);
      setModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Cadastro de Empresa</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="flex flex-col">
          <label className="font-medium mb-1">Razão Social</label>
          <input
            type="text"
            name="razaoSocial"
            value={form.razaoSocial}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            maxLength={255}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1">CNPJ</label>
          <input
            type="text"
            name="cnpj"
            value={form.cnpj}
            onChange={handleCnpjChange}
            className="border p-2 rounded w-full"
            maxLength={18}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1">CEP</label>
          <input
            type="text"
            name="cep"
            value={form.cep}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            maxLength={8}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1">Cidade</label>
          <input
            type="text"
            name="cidade"
            value={form.cidade}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            maxLength={255}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1">Estado</label>
          <input
            type="text"
            name="estado"
            value={form.estado}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            maxLength={255}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1">Bairro</label>
          <input
            type="text"
            name="bairro"
            value={form.bairro}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            maxLength={255}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1">Complemento</label>
          <input
            type="text"
            name="complemento"
            value={form.complemento}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            maxLength={255}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Cadastrar Empresa
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
          <p className="text-lg text-center">Empresa cadastrada com sucesso!</p>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-4">
          <p className="text-lg text-center">{message}</p>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setModalOpen(false)}
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
