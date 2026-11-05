// Types des variables d'environnement (fichier .env)
interface ImportMetaEnv {
  /** Clé d'accès Web3Forms (vide = formulaire en mode démo). */
  readonly PUBLIC_WEB3FORMS_KEY?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
