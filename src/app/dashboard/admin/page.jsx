import { redirect } from 'next/navigation';

const AdminDashboardPage = () => {
    redirect("/dashboard/admin/profile");
};

export default AdminDashboardPage;