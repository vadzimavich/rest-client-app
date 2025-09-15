declare module 'postman-collection' {
  class Request {
    constructor(options: Record<string, unknown>);
  }
  export { Request };
}

declare module 'postman-code-generators' {
  interface PostmanLanguage {
    convert: (
      request: import('postman-collection').Request,
      options: Record<string, unknown>,
      callback: (error: Error | null, snippet?: string) => void
    ) => void;
  }

  interface CodeGenerators {
    getLanguage(lang: string): PostmanLanguage | undefined;
    getOptions(lang: PostmanLanguage, variant: string): Record<string, unknown>;
  }

  const main: CodeGenerators;
  export = main;
}