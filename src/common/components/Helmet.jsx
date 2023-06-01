/* eslint-disable react/no-danger */
import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

const Helmet = ({
  title, description, translations, url, image, card, type, twitterUser,
  unlisted, pathConnector, locales, publishedTime, keywords, modifiedTime,
  locale, slug, disableStaticCanonical,
}) => {
  const ogTitle = title.length > 0 ? title : '4Geeks';
  const translationsExists = Object.keys(translations).length > 0;
  const maxCharacters = 155;
  const descriptionCleaned = description.length > maxCharacters
    ? `${description.substring(0, maxCharacters)}...`
    : description;

  const cardLayout = {
    default: 'summary', // Title, description, and thumbnail.
    large: 'summary_large_image', // Similar to the Summary Card, but with a prominently-featured image.
    app: 'app', // A Card with a direct download to a mobile app.
  };

  // In case of translations have any of these keys, it will be replaced by the value
  const localeTranslation = {
    us: 'en',
    en: 'en',
  };

  const getLocalePath = () => Object.entries(translations).map(
    ([lang, slugTr]) => ({
      slug: slugTr,
      lang: localeTranslation[lang] || lang,
    }),
  );
  const currentlocaleLang = getLocalePath().find((l) => l.slug === slug && l?.lang === locale)?.lang || locale;

  const getCanonicalTranslationsLink = () => {
    if (currentlocaleLang !== 'en' && currentlocaleLang !== undefined) {
      return `https://4geeks.com/${currentlocaleLang}${pathConnector}/${slug}`;
    }
    if ((currentlocaleLang === 'en' || currentlocaleLang === 'us') && currentlocaleLang !== undefined) {
      return `https://4geeks.com${pathConnector}/${slug}`;
    }
    return `https://4geeks.com${locale !== 'en' ? `/${locale}` : ''}${pathConnector}/${slug}`;
  };
  const canonicalTranslationsLink = getCanonicalTranslationsLink();

  const getCanonicalLink = () => {
    if (locale !== 'en' && locale !== undefined) {
      return `https://4geeks.com/${locale}${pathConnector}`;
    }
    return `https://4geeks.com${pathConnector}`;
  };
  const canonicalLink = getCanonicalLink();

  return (
    <Head>
      <title>{title.length > 0 ? `${title} | 4Geeks` : '4Geeks'}</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC" crossOrigin="anonymous" />
      <meta name="description" content={descriptionCleaned} />
      {unlisted === true && <meta name="robots" content="noindex" />}
      <link rel="icon" href="/4Geeks.ico" />
      {/* <!-- Primary Meta Tags --> */}
      {Array.isArray(keywords) && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {typeof keywords === 'string' && keywords.length > 0 && <meta name="keywords" content={keywords} />}

      {locales.length > 0 && !translationsExists && !disableStaticCanonical && (
        <link rel="canonical" href={canonicalLink} />
      )}

      {/* <---------------- Single web pages (ex: /projects) ----------------> */}
      {locales.length > 0
      && !translationsExists
      && locales.map((lang) => {
        const locationLang = {
          us: 'en-US',
          en: 'en-US',
          es: 'es-ES',
        };
        return (['default', 'en'].includes(lang) ? (
          <React.Fragment key={`${lang} - ${pathConnector}`}>
            <link rel="alternate" hrefLang="x-default" href={`https://4geeks.com${pathConnector}`} />
            <link rel="alternate" hrefLang={locationLang[lang]} href={`https://4geeks.com${pathConnector}`} />
          </React.Fragment>
        ) : (
          <link key={`${lang} - ${pathConnector} alternate`} rel="alternate" hrefLang={locationLang[lang]} href={`https://4geeks.com/${lang}${pathConnector}`} />
        ));
      })}

      {/* <---------------- Assets (generated by endpoint) ----------------> */}
      {translationsExists && !disableStaticCanonical && (
        <link rel="canonical" href={canonicalTranslationsLink} />
      )}

      {translationsExists && Object.keys(translations).map((lang) => {
        const language = lang === 'us' ? 'en' : lang;

        const locationLang = {
          us: 'en-US',
          en: 'en-US',
          es: 'es-ES',
        };
        const urlAlternate = `https://4geeks.com/${language}${pathConnector}/${translations[lang]}`;
        const defaultUrl = `https://4geeks.com${pathConnector}/${translations?.us || translations?.en}`;

        return ['default', 'us', 'en'].includes(lang) ? (
          <React.Fragment key={`${language} - ${defaultUrl}`}>
            <link rel="alternate" hrefLang="x-default" href={defaultUrl} />
            <link rel="alternate" hrefLang={locationLang[lang] || 'en-US'} href={defaultUrl} />
          </React.Fragment>
        ) : (
          <link key={`${language} - ${urlAlternate}`} rel="alternate" hrefLang={locationLang[lang]} href={urlAlternate} />
        );
      })}

      {/* <---------------- Open Graph protocol ----------------> */}
      <meta property="og:site_name" content="4Geeks" />
      <meta property="og:title" content={ogTitle} />

      {/* og:url is reference to Canonical URL */}
      <meta property="og:url" content={url.length > 0 ? `https://4geeks.com${currentlocaleLang !== 'en' ? `/${currentlocaleLang}` : ''}${url}` : 'https://4geeks.com'} />
      <meta property="og:description" content={descriptionCleaned} />
      <meta property="og:image" content={image} />
      {locales.length > 0 && locales.map((lang) => lang !== 'default' && (
        <React.Fragment key={lang}>
          {locale === lang ? (
            <meta content={lang} property="og:locale" />
          ) : (
            <meta content={lang} property="og:locale:alternate" />
          )}
        </React.Fragment>
      ))}
      {image.includes('https:') && <meta property="og:image:secure_url" content={image} />}
      {/* <meta property="og:image:width" content={imageProps.width} />
      <meta property="og:image:height" content={imageProps.height} /> */}

      <meta property="og:type" content={type} />
      {type === 'article' && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === 'article' && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* <---------------- Twitter ----------------> */}
      <meta property="twitter:card" content={cardLayout[card]} />
      <meta property="twitter:site" content={twitterUser} />
      <meta property="twitter:title" content={ogTitle} />
      <meta property="twitter:description" content={descriptionCleaned} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:image:alt" content={descriptionCleaned} />
    </Head>
  );
};

Helmet.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  type: PropTypes.string,
  twitterUser: PropTypes.string,
  unlisted: PropTypes.bool,
  translations: PropTypes.objectOf(PropTypes.any),
  pathConnector: PropTypes.string,
  locales: PropTypes.arrayOf(PropTypes.string),
  publishedTime: PropTypes.string,
  modifiedTime: PropTypes.string,
  keywords: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  card: PropTypes.string,
  locale: PropTypes.string,
  slug: PropTypes.string,
  disableStaticCanonical: PropTypes.bool,
};

Helmet.defaultProps = {
  title: '',
  url: '',
  description: "4Geeks's mission is to accelerate the way software developers learn and evolve.",
  image: 'https://4geeks.com/static/images/4geeks.png',
  type: 'website',
  twitterUser: '@4GeeksAcademy',
  unlisted: false,
  translations: {},
  pathConnector: '',
  locales: [],
  publishedTime: '',
  modifiedTime: '',
  keywords: 'programming bootcamp, programming course, professional mentoring',
  card: 'default',
  locale: '',
  slug: '',
  disableStaticCanonical: false,
};

export default Helmet;
