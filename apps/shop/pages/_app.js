import '@/app/globals.css';
import UpdateWrapper from "@/components/UpdateWrapper";
import ClientAuthProvider from "@/components/ClientAuthProvider";
import ClientCartProvider from "@/components/ClientCartProvider";
import ConditionalFooter from "@/components/ConditionalFooter";
import ConditionalHeader from "@/components/ConditionalHeader";
import ConditionalNavbar from "@/components/ConditionalNavbar";

export default function App({ Component, pageProps }) {
  return (
    <ClientAuthProvider>
      <ClientCartProvider>
        <UpdateWrapper />
        <ConditionalHeader />
        <ConditionalNavbar />
        <main className="">
          <Component {...pageProps} />
        </main>
        <ConditionalFooter />
      </ClientCartProvider>
    </ClientAuthProvider>
  );
}

