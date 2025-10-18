/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUSTRALIAN_POST_API_KEY: string
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_VERSION?: string
  // Add other environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
















