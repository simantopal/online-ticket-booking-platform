"use client"
import { useSession } from '@/lib/auth-client';
import React from 'react';

const VendorDashboardPage = () => {
    const {data: session, isPending} = useSession();

    if(isPending){
        return <div>Loading...</div>
    }

    const user = session?.user;
    console.log("session data in vendorDash", session)

    return (
        <div>
            <h2 className='text-2xl font-bold'>Welcome back, {user?.name}</h2>
        </div>
    );
};

export default VendorDashboardPage;