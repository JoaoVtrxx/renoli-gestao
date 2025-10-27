import Sidebar from "~/components/layout/Sidebar";
import Header from "~/components/layout/Header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // A classe `bg-background` foi movida para o div principal para cobrir toda a tela
    <div className="min-h-screen bg-background">
      {/* A MUDANÇA PRINCIPAL ACONTECE AQUI.
        Adicionamos a classe `fixed` à Sidebar para que ela fique "pregada" na tela.
        `h-full` garante que ela ocupe toda a altura.
        `z-20` garante que ela fique acima de outros elementos.
      */}
      <div className="fixed h-full z-20">
        <Sidebar />
      </div>
      
      {/* A SEGUNDA MUDANÇA.
        Como a Sidebar agora está "fixa" (fora do fluxo normal da página),
        precisamos "empurrar" o conteúdo principal para a direita para que ele não
        fique escondido atrás dela. A Sidebar tem largura w-64, então adicionamos
        uma margem à esquerda de ml-64.
      */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}