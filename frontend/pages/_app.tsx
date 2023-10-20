import '../styles/globals.css';
import '../styles/buttons.css';
import type { AppProps } from 'next/app';
import { Inter } from '@next/font/google';
import { wrapper } from '@/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';

const inter = Inter({ subsets: ['latin'] });

function MyApp({ Component, pageProps }: AppProps) {
  const store: any = useStore();
  return (
    <PersistGate persistor={store.__persistor} loading={<div>Loading</div>}>
      <style jsx global>{`
        body {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </PersistGate>
  );
}

export default wrapper.withRedux(MyApp);
