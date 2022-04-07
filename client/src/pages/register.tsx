import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { InputFeild } from '../components/InputFiled';
import { Wrapper } from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { withApollo } from '../utils/withApollo';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  return (
    <Wrapper variant={'small'}>
      <Formik
        initialValues={{ email: '', username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ variables: { options: values } });

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
              label='username'
              name='username'
              type='text'
            ></InputFeild>
            <InputFeild label='email' name='email' type='email'></InputFeild>
            <Box mt={4}>
              <InputFeild
                label='password'
                name='password'
                type='password'
              ></InputFeild>
            </Box>
            <Button
              isLoading={isSubmitting}
              mt={4}
              colorScheme='teal'
              type={'submit'}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Register);
