// import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  useColorModeValue,
  Stack,
  Grid,
  Input,
  Button,
  Flex,
  InputLeftElement,
  InputGroup,
  useDisclosure,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Heading from '../../common/components/Heading';
import Text from '../../common/components/Text';
import Link from '../../common/components/NextChakraLink';
import Image from '../../common/components/Image';
import TagCapsule from '../../common/components/TagCapsule';
import Icon from '../../common/components/Icon';
import FilterModal from '../../common/components/FilterModal';

export const getStaticProps = async ({ locale }) => {
  const data = await fetch(
    'https://breathecode-test.herokuapp.com/v1/registry/asset?type=exercise&big=true',
    {
      Accept: 'application/json, text/plain, */*',
    },
  ).then((res) => res.json());

  return {
    props: {
      ...(await serverSideTranslations(locale, ['home', 'navbar', 'footer'])),
      exercises: data,
    },
  };
};

// Component to adapt responsive style like figma
const TitleContent = ({ title, mobile }) => (
  <Flex
    alignItems="center"
    gridGap="20px"
    padding={mobile === true ? '4% 4% 0 4%' : ''}
    display={mobile === true ? { base: 'flex', md: 'none' } : { base: 'none', md: 'flex' }}
  >
    <Box
      display="flex"
      justifyContent="center"
      width="35px"
      height="35px"
      borderRadius="3rem"
      backgroundColor="yellow.default"
    >
      <Icon icon="strength" color="white" width="22px" />
    </Box>

    <Heading as="h1" size="30px">
      {title}
    </Heading>
  </Flex>
);

function Exercices({ exercises }) {
  // const { t } = useTranslation(['home']);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const defaultImage = '/static/images/code1.png';
  const bgBlur = '/static/images/codeBlur.png';
  console.log('PREVIEW', exercises);

  const onImageNotFound = (event) => {
    event.target.setAttribute('src', defaultImage);
    event.target.setAttribute('srcset', `${defaultImage} 1x`);
  };

  return (
    <Box height="100%" flexDirection="column" justifyContent="center" alignItems="center">
      <TitleContent title="Practices" mobile />
      <Flex
        justifyContent="space-between"
        flex="1"
        gridGap="20px"
        padding={{ base: '3% 4% 4% 4%', md: '1.5% 10% 1.5% 10%' }}
        borderBottom={1}
        borderStyle="solid"
        borderColor={useColorModeValue('gray.200', 'gray.900')}
      >
        <TitleContent title="Practices" mobile={false} />

        <InputGroup width={{ base: '-webkit-fill-available', md: '36rem' }}>
          <InputLeftElement pointerEvents="none">
            <Icon icon="search" color="gray" width="16px" height="16px" />
          </InputLeftElement>
          <Input
            id="search"
            width="100%"
            placeholder="Search Project"
            transition="all .2s ease"
            style={{
              borderRadius: '3px',
              backgroundColor: useColorModeValue('white', '#2D3748'),
            }}
          />
        </InputGroup>

        <Button
          variant="outline"
          backgroundColor={useColorModeValue('', 'gray.800')}
          _hover={{ backgroundColor: useColorModeValue('', 'gray.700') }}
          border={1}
          onClick={onOpen}
          borderStyle="solid"
          minWidth="125px"
          borderColor={useColorModeValue('#DADADA', 'gray.800')}
        >
          <Icon icon="setting" width="20px" height="20px" style={{ minWidth: '20px' }} />
          <Text textTransform="uppercase" pl="10px">
            Filter
          </Text>
        </Button>
        <FilterModal isOpen={isOpen} onClose={onClose} />
      </Flex>

      <Box flex="1" margin={{ base: '0 4% 0 4%', md: '0 10% 0 10%' }}>
        <Text
          size="md"
          display="flex"
          padding={{ base: '30px 8%', md: '30px 28%' }}
          textAlign="center"
        >
          The following lessons explain different programing concepts and have been published by
          breathe code members, search for a partiulars lesson using the filters bellow
        </Text>

        <Grid
          gridTemplateColumns={{
            base: 'repeat(auto-fill, minmax(15rem, 1fr))',
            md: 'repeat(auto-fill, minmax(20rem, 1fr))',
          }}
          gridGap="12px"
        >
          {exercises.map((ex) => {
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
                    href={`/interactive-exercises/${ex.slug}`}
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
                        gap="10px"
                        paddingX="0"
                        key={`${ex.slug}-${ex.difficulty}`}
                      />
                    )}

                    <Stack align="center" padding="18px 0 0 0">
                      <Link
                        href={`/interactive-exercises/${ex.slug}`}
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
      </Box>
    </Box>
  );
}

Exercices.propTypes = {
  exercises: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};
Exercices.defaultProps = {
  exercises: [],
};
TitleContent.propTypes = {
  title: PropTypes.string,
  mobile: PropTypes.bool,
};
TitleContent.defaultProps = {
  title: 'Title',
  mobile: true,
};

export default Exercices;
