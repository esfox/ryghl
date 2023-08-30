import { apiService } from '@/services/api.service';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import { toast } from 'react-hot-toast';

interface LoginForm extends HTMLFormElement {
  password: HTMLInputElement;
}

export default function Login() {
  const { replace } = useRouter();

  const { mutateAsync: login, isLoading } = useMutation({
    mutationFn: async (password: string) => {
      await apiService.login(password);
      await replace('/pages');
    },
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as LoginForm;
    const password = form.password.value;
    try {
      await login(password);
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
        <button type="submit" className="btn btn-primary mt-6" disabled={isLoading}>
          Login
        </button>
      </form>
    </main>
  );
}
