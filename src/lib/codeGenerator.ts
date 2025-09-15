import { RequestState } from '@/types/request';

export async function generateCodeSnippet(
  requestState: RequestState,
  language: string,
  variant: string
): Promise<string> {
  const { Request } = await import('postman-collection');
  
  const postmanCodeGeneratorsModule = await import('postman-code-generators');
  const postmanCodeGenerators = postmanCodeGeneratorsModule.default;

  return new Promise((resolve, reject) => {
    try {
      const { method, url, headers, body } = requestState;

      const postmanRequest = new Request({
        method,
        url,
        header: headers.filter(h => h.key).map(h => ({ key: h.key, value: h.value })),
        body: {
          mode: 'raw',
          raw: body,
        },
      });

      postmanCodeGenerators.convert(
        language,
        variant,
        postmanRequest,
        {},
        (error: Error | null, snippet: string | undefined) => {
          if (error) {
            return reject(error);
          }
          if (snippet) {
            resolve(snippet);
          } else {
            reject(new Error('Snippet generation resulted in an empty value.'));
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}