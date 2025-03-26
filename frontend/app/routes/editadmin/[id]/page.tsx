import EditAdmin from '@/components/editadmin';

export default function EditAdminPage({
  params
}: {
  params: { id: string } // ← Ahora usa 'id' en lugar de 'adminID'
}) {
  return <EditAdmin adminID={params.id} />; // Pasa params.id como adminID
}
