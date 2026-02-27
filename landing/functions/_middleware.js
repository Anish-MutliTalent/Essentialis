export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const response = await next();

  if (
    pathname.includes('/my-docs') ||
    pathname.includes('/zetajs') ||
    pathname.includes('/zetaoffice') ||
    pathname.includes('/pdf.worker')
  ) {
    const headers = new Headers(response.headers);

    headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    headers.set('Cross-Origin-Opener-Policy', 'same-origin');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return response;
}
