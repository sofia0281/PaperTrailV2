type Props = {
  numeroFactura: string;
  numeroPedido: string;
  fechaCompra: string;
};

export default function EncabezadoDevolucion({ numeroFactura, numeroPedido, fechaCompra }: Props) {
  return (
    <div className="relative z-10 p-12">
      <h2 className="text-4xl font-semibold mb-2">Solicitar devolución</h2>
      <p className="text-md">Número de Factura: {numeroFactura}</p>
      <p className="text-md">Número de pedido: {numeroPedido}</p>
      <p className="text-md">Fecha de la compra: {fechaCompra}</p>
    </div>
  );
}
