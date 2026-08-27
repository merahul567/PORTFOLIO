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

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`${SITE.url}/RK_logo.png`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
