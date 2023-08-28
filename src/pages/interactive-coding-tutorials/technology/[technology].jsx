import useTranslation from 'next-translate/useTranslation';
import {
  Box, useColorModeValue,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Text from '../../../common/components/Text';
import { WHITE_LABEL_ACADEMY, toCapitalize } from '../../../utils';
import Heading from '../../../common/components/Heading';
import ProjectList from '../../../js_modules/projects/ProjectList';
import { parseQuerys } from '../../../utils/url';

export const getStaticPaths = async ({ locales }) => {
  const resp = await fetch(`${process.env.BREATHECODE_HOST}/v1/registry/academy/technology?limit=1000&academy=${WHITE_LABEL_ACADEMY}`, {
    method: 'GET',
    headers: {
      Authorization: `Token ${process.env.BC_ACADEMY_TOKEN}`,
      Academy: 4,
    },
  });
  const data = resp?.status > 400 ? {} : await resp?.json();

  const paths = data?.results?.length > 0 ? data?.results?.flatMap((res) => locales.map((locale) => ({
    params: {
      technology: res?.slug,
    },
    locale,
  }))) : [];

  return {
    fallback: false,
    paths,
  };
};

export const getStaticProps = async ({ params, locale, locales }) => {
  const { technology } = params;
  const currentLang = locale === 'en' ? 'us' : 'es';

  const responseTechs = await fetch(`${process.env.BREATHECODE_HOST}/v1/registry/academy/technology?slug=${technology}&limit=1000&academy=${WHITE_LABEL_ACADEMY}`, {
    method: 'GET',
    headers: {
      Authorization: `Token ${process.env.BC_ACADEMY_TOKEN}`,
      Academy: 4,
    },
  });
  const techs = await responseTechs.json(); // array of objects
  const technologyData = techs.results.find((tech) => tech.slug === technology);

  const qs = parseQuerys({
    asset_type: 'PROJECT',
    visibility: 'PUBLIC',
    status: 'PUBLISHED',
    academy: WHITE_LABEL_ACADEMY,
    limit: 1000,
    technologies: technology,
  });
  const response = await fetch(`${process.env.BREATHECODE_HOST}/v1/registry/asset${qs}`);
  const projects = await response.json();

  const dataFiltered = projects?.results;

  if (responseTechs.status >= 400 || response.status >= 400 || response.status_code >= 400
    || !technologyData || dataFiltered.length === 0) {
    return {
      notFound: true,
    };
  }

  const ogUrl = {
    en: `/interactive-coding-tutorials/technology/${technology}`,
    us: `/interactive-coding-tutorials/technology/${technology}`,
  };

  return {
    props: {
      seo: {
        title: technologyData?.title,
        description: '',
        image: technologyData?.icon_url || '',
        pathConnector: `/interactive-coding-tutorials/technology/${technology}`,
        url: ogUrl.en,
        type: 'website',
        card: 'default',
        locales,
        locale,
      },
      technologyData,
      fallback: false,
      projects: dataFiltered.filter((project) => project.lang === currentLang).map(
        (l) => ({ ...l, difficulty: l.difficulty?.toLowerCase() || null }),
      ),
    },
  };
};

function ProjectsByTechnology({ projects, technologyData }) {
  const { t } = useTranslation('projects');

  // const translations = projects?.translations || { es: '', en: '', us: '' };

  return (
    <Box
      height="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      pt="3rem"
      margin={{ base: '0 4% 0 4%', md: '0 10% 0 10%' }}
    >
      <Text
        as="h1"
        fontSize="15px"
        color={useColorModeValue('blue.default', 'blue.300')}
        display="inline-block"
        fontWeight="700"
        paddingBottom="6px"
      >
        {t('landing-technology.title', { technology: toCapitalize(technologyData?.title) })}
      </Text>
      <Box flex="1" pb="2rem">
        <Heading as="span" size="xl">
          {t('landing-technology.subTitle', { technology: toCapitalize(technologyData?.title) })}
        </Heading>

        <Text
          size="md"
          pt="0.6rem"
          width={{ base: '100%', md: '65%' }}
          display="flex"
          // padding={{ base: '30px 8%', md: '30px 28%' }}
          textAlign="left"
        >
          {technologyData?.description || t('description')}
        </Text>
      </Box>

      {projects?.length > 0 && (
        <ProjectList
          projects={projects}
          // withoutImage
          // isLoading={isLoading}
          // contextFilter={}
          projectPath="interactive-coding-tutorial"
          pathWithDifficulty
          notFoundMessage={t('common:asset-not-found-in-current-language')}
        />
      )}
    </Box>
  );
}

ProjectsByTechnology.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([PropTypes.any]))).isRequired,
  technologyData: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.any])).isRequired,
};

export default ProjectsByTechnology;
