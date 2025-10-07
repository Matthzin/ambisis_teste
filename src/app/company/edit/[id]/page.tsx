"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Modal from "@/components/Modal";

interface EmpresaForm {
  razaoSocial: string;
  cnpj: string;
  cep: string;
  cidade: string;
  estado: string;
  bairro: string;
  complemento: string;
}

export default function EditCompany() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [form, setForm] = useState<EmpresaForm>({
    razaoSocial: "",
    cnpj: "",
    cep: "",
    cidade: "",
    estado: "",
    bairro: "",
    complemento: "",
  });

  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [redirectAfterClose, setRedirectAfterClose] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchEmpresa() {
      try {
        const res = await fetch(`/api/companies/${id}`);
        if (!res.ok) throw new Error("Erro ao carregar empresa");
        const data = await res.json();
        setForm({
          razaoSocial: data.razaoSocial,
          cnpj: data.cnpj,
          cep: data.cep,
          cidade: data.cidade,
          estado: data.estado,
          bairro: data.bairro,
          complemento: data.complemento ?? "",
        });
      } catch (error) {
        console.error(error);
        setMessage("Erro ao carregar os dados da empresa.");
        setRedirectAfterClose(true);
        setMessageModalOpen(true);
      } finally {
        setLoading(false);
      }
    }

    fetchEmpresa();
  }, [id]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmModalOpen(true);
  };

  const confirmEdit = async () => {
    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage("Empresa atualizada com sucesso!");
        setRedirectAfterClose(true);
      } else {
        const error = await res.json();
        setMessage(`Erro: ${error.message}`);
        setRedirectAfterClose(false);
      }
    } catch (error) {
      console.error(error);
      setMessage("Erro ao atualizar empresa.");
      setRedirectAfterClose(false);
    } finally {
      setConfirmModalOpen(false);
      setMessageModalOpen(true);
    }
  };

  const closeMessageModal = () => {
    setMessageModalOpen(false);
    if (redirectAfterClose) {
      router.push("/");
    }
  };

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="flex flex-col items-center p-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Editar Empresa</h1>

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
            Concluir Edição
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
          <p className="text-lg mb-4">
            Deseja realmente concluir a edição desta empresa?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setConfirmModalOpen(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              onClick={confirmEdit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={messageModalOpen} onClose={closeMessageModal}>
        <div className="p-4">
          <p className="text-lg mb-4 text-center">{message}</p>
          <div className="flex justify-center">
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
