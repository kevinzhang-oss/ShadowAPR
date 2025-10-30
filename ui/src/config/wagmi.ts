import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: '',
  projectId: 'f3d9f23af7a4c0f87a2f9cc1b7f0e3b',
  chains: [sepolia],
  ssr: false,
});
