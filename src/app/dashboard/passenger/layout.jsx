export const dynamic = "force-dynamic";

import { requireRole } from '@/lib/core/session';
import React from 'react';

const PassengerLayout = async({children}) => {
    await requireRole('passenger');
    return children;
};

export default PassengerLayout;