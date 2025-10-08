"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Modal from "@/components/Modal";

interface LicenseForm {
  numero: string;
  orgaoAmbiental: string;
  emissao: string;
  validade: string;
}

export default function EditLicense() {
  const router = useRouter();
  const params = useParams();
  const licenseId = params.id;

  const [form, setForm] = useState<LicenseForm>({
    numero: "",
    orgaoAmbiental: "",
    emissao: "",
    validade: "",
  });

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchLicense() {
      try {
        const res = await fetch(`/api/licenses/${licenseId}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            numero: data.numero,
            orgaoAmbiental: data.orgaoAmbiental,
            emissao: data.emissao
              ? new Date(data.emissao).toISOString().split("T")[0]
              : "",
            validade: data.validade
              ? new Date(data.validade).toISOString().split("T")[0]
              : "",
          });
        } else {
          const error = await res.json();
          setMessage(`Erro ao carregar licença: ${error.message}`);
          setMessageModalOpen(true);
        }
      } catch (error) {
        console.error(error);
        setMessage("Erro ao carregar licença.");
        setMessageModalOpen(true);
      }
    }
    fetchLicense();
  }, [licenseId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmModalOpen(true);
  };

  const confirmEdit = async () => {
    try {
      const res = await fetch(`/api/licenses/${licenseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage("Licença atualizada com sucesso!");
      } else {
        const error = await res.json();
        setMessage(`Erro: ${error.message}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("Erro ao atualizar licença.");
    } finally {
      setConfirmModalOpen(false);
      setMessageModalOpen(true);
    }
  };

  const closeMessageModal = () => {
    setMessageModalOpen(false);
    if (message === "Licença atualizada com sucesso!") {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center p-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Editar Licença</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4 bg-white p-6 rounded-lg shadow-md"
      >
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
            Atualizar Licença
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
            Confirma a atualização desta licença?
          </p>
          <div className="flex justify-center gap-3">
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
