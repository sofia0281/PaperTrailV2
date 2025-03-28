// app/routes/editadmin/[id]/page.tsx
import EditAdmin from '@/components/editadmin';

export default async function EditAdminPage({
  params
}: {
  params: { id: number }
}) {
  // Puedes cargar datos aquí directamente
  return <EditAdmin adminID={params.id} />;
}

