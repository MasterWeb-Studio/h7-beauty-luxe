import { Suspense } from 'react';
import { LoginForm } from './LoginForm';

// /admin/login — public (middleware.ts PUBLIC_PATHS listesinde).
// Sayfa wrapper server component; form client'ta (useSearchParams için Suspense).

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
