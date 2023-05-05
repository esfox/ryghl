import { useAuth } from '@/hooks/useAuth';

import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import { toast } from 'react-hot-toast';

interface LoginForm extends HTMLFormElement {
  password: HTMLInputElement;
}

export default function Login() {
  const { login } = useAuth();
  const { replace } = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as LoginForm;
    const password = form.password.value;
    try {
      await login(password);
      await replace('/pages');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      toast.error('Invalid password');
    }
  };

  return (
    <main className="grid place-items-center h-full">
      <form className="text-center" onSubmit={onSubmit}>
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="input input-bordered block"
        />
        <button type="submit" className="btn btn-primary mt-6">
          Login
        </button>
      </form>
    </main>
  );
}
