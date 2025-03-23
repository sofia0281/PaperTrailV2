import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';


const withAuth = (WrappedComponent) => {
    const Wrapper = (props) => {
        const { authUser, authToken } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!authUser || !authToken) {
                router.push('/routes/login'); // Redirige al login si no está autenticado
            }
        }, [authUser, authToken, router]);

        return <WrappedComponent {...props} />;
    };

    return Wrapper;
};

export default withAuth;