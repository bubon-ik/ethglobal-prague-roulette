import { createConfig, http } from 'wagmi';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';
import scaffoldConfig from '~~/scaffold.config';

export const wagmiConfig = createConfig({
  chains: scaffoldConfig.targetNetworks,
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Site Discovery Roulette',
    }),
    walletConnect({
      projectId: scaffoldConfig.walletConnectProjectId,
    }),
  ],
  transports: {
    [scaffoldConfig.targetNetworks[0].id]: http(),
  },
  ssr: true,
});
