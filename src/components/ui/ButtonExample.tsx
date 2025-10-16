// Exemplo de uso do componente Button
// Este arquivo é apenas para demonstração

import Button from "~/components/ui/Button";

export default function ButtonExample() {
  const handleClick = () => {
    alert("Botão clicado!");
  };

  return (
    <div className="p-8 space-y-6 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Exemplos de Button</h1>

      {/* Button Primary (padrão) */}
      <Button onClick={handleClick}>
        <div className="text-left">
          <div className="font-bold">Botão Primary</div>
          <div className="text-sm opacity-90">Estilo padrão do botão</div>
        </div>
      </Button>

      {/* Button Secondary */}
      <Button variant="secondary" onClick={handleClick}>
        <div className="text-left">
          <div className="font-bold">Botão Secondary</div>
          <div className="text-sm text-gray-600">Estilo secundário</div>
        </div>
      </Button>

      {/* Button Success */}
      <Button variant="success" onClick={handleClick}>
        <div className="text-left">
          <div className="font-bold">Botão Success</div>
          <div className="text-sm opacity-90">Estilo de sucesso (verde)</div>
        </div>
      </Button>

      {/* Button Info */}
      <Button variant="info" onClick={handleClick}>
        <div className="text-left">
          <div className="font-bold">Botão Info</div>
          <div className="text-sm opacity-90">Estilo informativo (azul)</div>
        </div>
      </Button>

      {/* Button Accent */}
      <Button variant="accent" onClick={handleClick}>
        <div className="text-left">
          <div className="font-bold">Botão Accent</div>
          <div className="text-sm opacity-90">Estilo de destaque (roxo)</div>
        </div>
      </Button>

      {/* Button com classes customizadas */}
      <Button 
        variant="primary" 
        className="bg-green-600 hover:bg-green-700"
        onClick={handleClick}
      >
        <div className="text-left">
          <div className="font-bold">Botão Customizado</div>
          <div className="text-sm opacity-90">Com cores personalizadas</div>
        </div>
      </Button>

      {/* Button desabilitado */}
      <Button disabled onClick={handleClick}>
        <div className="text-left">
          <div className="font-bold">Botão Desabilitado</div>
          <div className="text-sm opacity-90">Este botão está desabilitado</div>
        </div>
      </Button>

      {/* Button com conteúdo simples */}
      <Button variant="secondary" className="text-center">
        Botão Simples
      </Button>
    </div>
  );
}