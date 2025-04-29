import Books from '@/components/General/vistaLibro'

export default async function  BookPage( {
    params
}: {
  params: { id: string }
}) 
{
    return <Books idLibro ={params.id} />;
}


