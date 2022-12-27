import "@rainbow-me/rainbowkit/styles.css"
import "../styles/global.css"
import type { AppProps } from "next/app"
import { WagmiConfig } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { chains, wagmiClient } from "../config/walletConfig"
import { RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth"
import { getSession, SessionProvider } from "next-auth/react"
import { GetServerSideProps } from "next"
import { getToken } from "next-auth/jwt"
import { GetSiweMessageOptions } from "@rainbow-me/rainbowkit-siwe-next-auth/dist/RainbowKitSiweNextAuthProvider"

export default function App({ Component, pageProps }: AppProps) {
  const getSiweMessageOptions: GetSiweMessageOptions = () => ({
    statement: "Sign in with Ethereum to the Mint NFT.",
  })

  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >
          <RainbowKitProvider chains={chains}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  const token = await getToken({ req: context.req })
  const address = token?.sub ?? null
  return {
    props: {
      session,
      address,
    },
  }
}
