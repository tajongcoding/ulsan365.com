export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const canonicalHost = 'ulsan365.com';
    const redirectHosts = new Set([
      'www.ulsan365.com',
      'asinayo.org',
      'www.asinayo.org',
    ]);

    const isPreviewHost =
      url.hostname.endsWith('.pages.dev') || url.hostname.endsWith('.workers.dev');
    const shouldRedirectHost = redirectHosts.has(url.hostname) || isPreviewHost;
    const shouldUpgradeProtocol =
      url.hostname === canonicalHost && url.protocol !== 'https:';

    if (shouldRedirectHost || shouldUpgradeProtocol) {
      url.protocol = 'https:';
      url.hostname = canonicalHost;
      return Response.redirect(url.toString(), 308);
    }

    return env.ASSETS.fetch(request);
  },
};
