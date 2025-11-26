"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui";
import toast from "react-hot-toast";
import { saveAs } from "file-saver";

interface ContractButtonProps {
  veiculoId: string;
}

export default function ContractButton({ veiculoId }: ContractButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const { mutate: generateContract } = api.veiculo.generateContract.useMutation({
    onSuccess: (result) => {
      try {
        // Converter base64 para Blob
        const byteCharacters = atob(result.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        // Fazer download do arquivo
        saveAs(blob, result.filename);

        toast.success("Contrato gerado com sucesso!");
        setIsGenerating(false);
      } catch (error) {
        console.error("Erro ao processar arquivo:", error);
        toast.error("Erro ao processar o arquivo do contrato");
        setIsGenerating(false);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao gerar contrato");
      setIsGenerating(false);
    },
  });

  const handleGenerateContract = () => {
    setIsGenerating(true);
    generateContract({ id: veiculoId });
  };

  return (
    <Button
      onClick={handleGenerateContract}
      disabled={isGenerating}
      variant="primary"
      className="flex items-center gap-2"
    >
      {isGenerating ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Gerando...
        </>
      ) : (
        <>
          <FileText className="h-5 w-5" />
          Gerar Contrato
        </>
      )}
    </Button>
  );
}
