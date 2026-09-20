import { redirect } from 'next/navigation';

export default function ConfigurePage() {
  redirect('/');
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};
