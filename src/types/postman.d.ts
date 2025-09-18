declare module 'postman-collection' {
  class Request {
    constructor(options: Record<string, unknown>);
  }
  export { Request };
}

declare module 'postman-code-generators' {
  interface PostmanCodeGenerators {
    convert: (
      language: string,
      variant: string,
      request: import('postman-collection').Request,
      options: Record<string, unknown>,
      callback: (error: Error | null, snippet?: string) => void
    ) => void;

    getLanguage: (lang: string) => unknown | undefined;
    getOptions: (lang: string, variant: string) => Record<string, unknown>;
  }

  const main: PostmanCodeGenerators;
  export = main;
}