import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    const { authUser, authToken, loading } = useAuth();
    const [checkedAuth, setCheckedAuth] = useState(false);

    useEffect(() => {
      if (!loading && !checkedAuth) {
        if (!authUser || !authToken) {
          router.push("/routes/login");
        }
        setCheckedAuth(true); // Evita revisar múltiples veces
      }
    }, [authUser, authToken, loading, checkedAuth, router]);

    if (loading || !checkedAuth) {
      return <div>Cargando...</div>;
    }

    return authUser ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};

export default withAuth;