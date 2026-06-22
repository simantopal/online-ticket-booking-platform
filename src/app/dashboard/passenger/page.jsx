import { redirect } from 'next/navigation';
import React from 'react';

const PassengerDashboardPage = () => {
    redirect("/dashboard/passenger/profile");
};

export default PassengerDashboardPage;