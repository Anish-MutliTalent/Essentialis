declare module "*.css" {
  const content: any;
  export default content;
}

interface ImportMetaEnv {
  /**
   * Absolute base URL for the backend API (e.g. "https://essentialis.cloud").
   * Leave empty to use same-origin relative `/api` paths (recommended in
   * production when the landing is served behind the same reverse proxy).
   */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
