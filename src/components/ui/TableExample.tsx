// Exemplo de uso dos componentes Table e Badge
// Este arquivo é apenas para demonstração

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
} from "~/components/ui";

export default function TableExample() {
  const veiculos = [
    { id: 1, marca: "Toyota", modelo: "Corolla", ano: 2022, status: "Disponível", tipo: "Compra" },
    { id: 2, marca: "Honda", modelo: "Civic", ano: 2021, status: "Reservado", tipo: "Consignação" },
    { id: 3, marca: "Ford", modelo: "Focus", ano: 2020, status: "Vendido", tipo: "Compra" },
    { id: 4, marca: "Volkswagen", modelo: "Jetta", ano: 2023, status: "Disponível", tipo: "Consignação" },
  ];

  const getStatusVariant = (status: string): "success" | "warning" | "secondary" => {
    switch (status) {
      case "Disponível":
        return "success";
      case "Reservado":
        return "warning";
      case "Vendido":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getTipoVariant = (tipo: string): "info" | "accent" => {
    switch (tipo) {
      case "Compra":
        return "info";
      case "Consignação":
        return "accent";
      default:
        return "info";
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Exemplo de Tabela com Badges</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {veiculos.map((veiculo) => (
              <TableRow key={veiculo.id}>
                <TableCell>{veiculo.id}</TableCell>
                <TableCell>
                  <div className="font-medium">
                    {veiculo.marca} {veiculo.modelo}
                  </div>
                </TableCell>
                <TableCell>{veiculo.ano}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(veiculo.status)}>
                    {veiculo.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getTipoVariant(veiculo.tipo)}>
                    {veiculo.tipo}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Variantes de Badge</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="success">Disponível</Badge>
          <Badge variant="warning">Reservado</Badge>
          <Badge variant="secondary">Vendido</Badge>
          <Badge variant="info">Compra</Badge>
          <Badge variant="accent">Consignação</Badge>
        </div>
      </div>
    </div>
  );
}