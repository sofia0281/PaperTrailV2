import EditTienda from "@/components/AdministacionTiendas/editTienda";
export default async function EditTiendaPage( {
    params
}: {
  params: { id: string }
}) 
{
    return <EditTienda tiendaID ={params.id} />;
}
