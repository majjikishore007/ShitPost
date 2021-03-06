import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputFeild } from '../components/InputFiled';
import { useRegisterMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClinet';
import { toErrorMap } from '../utils/toErrorMap';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Flex
      minH={'80vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={8} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'3xl'}>Create your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
          </Text>
        </Stack>
        <Formik
          initialValues={{ email: '', username: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {
            const response = await register({ options: values });

            if (response.data?.register.errors) {
              setErrors(toErrorMap(response.data.register.errors));
            } else if (response.data?.register.user) {
              router.push('/');
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputFeild
                label=''
                placeholder='Username'
                name='username'
                type='text'
              ></InputFeild>
              <InputFeild
                label=''
                name='email'
                type='email'
                placeholder='Email'
              ></InputFeild>
              <Box mt={4}>
                <InputFeild
                  placeholder='Password'
                  label=''
                  name='password'
                  type='password'
                ></InputFeild>
              </Box>

              <Stack spacing={10} pt={2}>
                <Button
                  isLoading={isSubmitting}
                  mt={4}
                  colorScheme='teal'
                  type={'submit'}
                >
                  Submit
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Stack>
    </Flex>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
