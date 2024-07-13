// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: [
    '~/assets/style.scss',
  ],
  plugins: [
    {
      src: 'plugins/useBootstrap.client.ts',
      mode: 'client'
    }
  ],
  modules: [
    '@pinia/nuxt',
  ],
  runtimeConfig: {
    public: {
      NETWORK_CHAIN_ID: process.env.NUXT_ENV_NETWORK_CHAIN_ID || "8008135",
      NETWORK_RPC_URL: process.env.NUXT_ENV_NETWORK_RPC_URL || "https://api.helium.fhenix.zone",
      NETWORK_EXPLORER_URL: process.env.NUXT_ENV_NETWORK_EXPLORER_URL || "https://your.explorer.url.here"
    }
  },
})
