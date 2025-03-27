import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuthROOT = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    const { authRole, authToken, loading } = useAuth();
    const [checkedAuth, setCheckedAuth] = useState(false);

    useEffect(() => {
        if (!loading && !checkedAuth) {
            if (authRole != "ROOT") {
                router.push("/routes/login");
            }
            setCheckedAuth(true); // Evita revisar múltiples veces
        }
    }, [authRole, authToken, loading, checkedAuth, router]);

    if (loading || !checkedAuth) {
        return <div>Cargando...</div>;
    }

    return authRole ? <WrappedComponent {...props} /> : null;
};

  return Wrapper;
};

export default withAuthROOT;