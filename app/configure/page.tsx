import type { Metadata } from 'next';
import { ConfiguratorClient } from '@/components/configurator/ConfiguratorClient';

export const metadata: Metadata = {
  title: 'Configure your challenge | CK Propfirm',
  description: 'Choose your CK Propfirm challenge, account size, platform, and optional trading extras.',
};

export default function ConfigurePage() {
  return <ConfiguratorClient />;
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};
