import EditBook from "@/components/AdministracionLibros/editBook";

export default async function EditBookPage( {
    params
}: {
  params: { id: string }
}) 
{
    return <EditBook bookID ={params.id} />;
}


