import { AddEditExercise } from '@/components/adminForms/addEditExercise';
import { AdminUpgradeForm } from '@/components/adminForms/upgradeForm';
import { Header } from '@/components/header';
import { Navbar } from '@/components/navbar';
import { ProtectRSC } from '@/components/protect/server';
import { db } from '@/db';
import { sections } from '@/db/schema';
import { clerkClient } from '@clerk/nextjs/server';

export default async function Home() {
  const ctx = await clerkClient();

  const users = await ctx.users.getUserList();
  const sectionData = await db.select().from(sections);

  // Filter out admins and format for combobox
  const usersForCombobox = users.data
    .filter((user) => user.publicMetadata.role !== 'admin')
    .map((user) => ({ value: user.id, label: user.fullName || user.id }));

  return (
    <ProtectRSC forAdmin>
      <main className="flex min-h-screen w-screen flex-col items-center">
        <Header />
        <div className="flex w-full flex-1 flex-col items-center gap-2 p-4 text-xl">
          <div className="bg-input/50 w-full rounded-lg border p-3">
            <h1 className="text-sm">Current Users</h1>
            <h2 className="text-2xl font-bold">{users.totalCount}</h2>
          </div>
          <AdminUpgradeForm users={usersForCombobox} />
          <AddEditExercise sections={sectionData} />
        </div>
        <Navbar active="admin" />
      </main>
    </ProtectRSC>
  );
}
