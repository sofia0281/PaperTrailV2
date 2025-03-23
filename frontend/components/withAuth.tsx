// components/withAuth.js
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const withAuth = (WrappedComponent) => {
    const Wrapper = (props) => {
        const { user, token } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!user || !token) {
                router.push('/routes/login'); // Redirige al login si no está autenticado
            }
        }, [user, token, router]);

            return <WrappedComponent {...props} />;
    };

    return Wrapper;
};

export default withAuth;