import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default async function AdminMusicoSocioPage() {
  const user = await getCurrentUser();

  if (!user || user.cargo !== 2) {
    redirect('/');
  }

  // O cargo híbrido 2 utiliza a interface unificada de administração com acesso total
  redirect('/admin');
}

