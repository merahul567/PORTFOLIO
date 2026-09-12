import React from "react";
import { Helmet } from "react-helmet-async";
import { defaultDescription, SITE } from "../siteConfig";

export default function Seo({
  title,
  description = defaultDescription,
  path = "/",
}) {
  const canonical = path === "/" ? `${SITE.url}/` : `${SITE.url}${path}`;
  const fullTitle = title.includes(SITE.name) ? title : `${title} · ${SITE.name}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    author: {
      "@type": "Person",
      name: SITE.author,
    },
    description,
    keywords: SITE.keywords.join(", "),
  };

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="author" content={SITE.author} />
      <meta name="keywords" content={SITE.keywords.join(", ")} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`${SITE.url}/favicon.ico`} />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:site" content="@rahulkumar" />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
