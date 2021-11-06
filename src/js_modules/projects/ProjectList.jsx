import {
  Box, useColorModeValue, Stack, Grid,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Heading from '../../common/components/Heading';
import Link from '../../common/components/NextChakraLink';
import Image from '../../common/components/Image';
import TagCapsule from '../../common/components/TagCapsule';

const ProjectList = ({ projects }) => {
  const defaultImage = '/static/images/code1.png';
  const bgBlur = '/static/images/codeBlur.png';

  const arrOfTags = ['apis'];

  // const Helpers = () => ({
  //   contains: (orig, filter) => {
  //     const res = filter.map((item) => orig.includes(item));
  //     return !res.includes(false);
  //   },
  //   hasDuplicates: (array) => new Set(array).size !== array.length,
  // });
  const contains = (orig, filter) => {
    const res = filter.map((item) => orig.includes(item));
    return !res.includes(false);
  };
  // NOTE: Starting with filter functions
  const filteredProjects = projects.filter((item) => contains(item.technologies, arrOfTags));

  const onImageNotFound = (event) => {
    event.target.setAttribute('src', defaultImage);
    event.target.setAttribute('srcset', `${defaultImage} 1x`);
  };
  return (
    <Grid
      gridTemplateColumns={{
        base: 'repeat(auto-fill, minmax(15rem, 1fr))',
        md: 'repeat(auto-fill, minmax(20rem, 1fr))',
      }}
      gridGap="12px"
    >
      {filteredProjects.map((ex) => {
        const getImage = ex.preview !== '' ? ex.preview : defaultImage;
        return (
          <Box
            py={2}
            key={`${ex.slug}-${ex.difficulty}`}
            border={useColorModeValue('1px solid #DADADA', 'none')}
            className="card pointer"
            bg={useColorModeValue('white', 'gray.800')}
            // boxShadow="xl"
            transition="transform .3s ease-in-out"
            _hover={{
              transform: 'scale(1.05)',
              boxShadow: '0 10px 20px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.06)',
            }}
            borderRadius="16px"
            padding="22px"
          >
            <Box
              display={{ base: 'flex', md: 'inline-block' }}
              gridGap="15px"
              role="group"
              w="full"
              zIndex={1}
              borderRadius="15px"
            >
              {/* CARD IMAGE */}
              <Link
                href={`/interactive-projects/${ex.slug}`}
                display="inline-block"
                w={{ base: 'auto', md: 'full' }}
                zIndex={1}
                borderRadius="15px"
              >
                <Image
                  priority
                  borderRadius="15px"
                  classNameImg="centerImageForBlur"
                  pos="relative"
                  height={{ base: '60px', sm: '90px', md: '180px' }}
                  width={{ base: '60px', sm: '90px', md: 'auto' }}
                  maxWidth={{ base: '300px', sm: '230px', md: 'none' }}
                  // NOTE: test performance in production - Blur Background
                  _after={{
                    transition: 'all .8s ease',
                    content: '""',
                    w: 'full',
                    h: 'full',
                    pos: 'absolute',
                    top: 0,
                    left: 0,
                    backgroundImage: `url(${bgBlur})`,
                    filter: 'blur(15px)',
                    zIndex: 0,
                  }}
                  _groupHover={{
                    _after: {
                      filter: 'blur(50px)',
                    },
                  }}
                  onError={(e) => onImageNotFound(e)}
                  style={{ borderRadius: '15px', overflow: 'hidden' }}
                  objectFit="cover"
                  src={getImage}
                  alt={ex.title}
                />
              </Link>
              <Box display="flex" flexDirection="column">
                {ex.technologies.length >= 1 && (
                  <TagCapsule
                    tags={ex.technologies}
                    variant="rounded"
                    marginY="8px"
                    style={{
                      padding: '2px 10px',
                      margin: '0',
                    }}
                    gap="10px"
                    paddingX="0"
                    key={`${ex.slug}-${ex.difficulty}`}
                  />
                )}

                <Stack align="center" padding="18px 0 0 0">
                  <Link
                    href={`/interactive-projects/${ex.slug}`}
                    display="inline-block"
                    w="full"
                    zIndex={1}
                    color="blue.default"
                  >
                    <Heading
                      size="20px"
                      textAlign="left"
                      width="100%"
                      fontFamily="body"
                      fontWeight={700}
                    >
                      {ex.title}
                    </Heading>
                  </Link>
                  {/* <Text
                    color="gray.500"
                    textAlign="left"
                    width="100%"
                    size="sm"
                    textTransform="uppercase"
                  >
                    All you&apos;ve learned needs to be put together. Lets make our first entire
                    professional application using the Agile Development method!
                  </Text> */}
                </Stack>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Grid>
  );
};

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ProjectList;
