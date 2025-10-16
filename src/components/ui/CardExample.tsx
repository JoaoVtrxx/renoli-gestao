// Exemplo de uso do componente Card
// Este arquivo é apenas para demonstração

import Card from "~/components/ui/Card";

export default function CardExample() {
  return (
    <div className="p-8 space-y-6">
      {/* Card básico */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Card Básico</h2>
        <p className="text-gray-600">
          Este é um exemplo de card básico usando apenas as classes padrão.
        </p>
      </Card>

      {/* Card com classes adicionais */}
      <Card className="border-l-4 border-blue-500">
        <h2 className="text-xl font-bold mb-4 text-blue-600">Card Customizado</h2>
        <p className="text-gray-600">
          Este card tem classes adicionais aplicadas: uma borda azul à esquerda.
        </p>
      </Card>

      {/* Card com mais estilos personalizados */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
        <h2 className="text-xl font-bold mb-4 text-purple-700">Card com Gradiente</h2>
        <p className="text-gray-700">
          Este card demonstra como sobrescrever o background padrão com classes customizadas.
        </p>
      </Card>
    </div>
  );
}