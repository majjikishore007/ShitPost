import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { InputFeild } from '../components/InputFiled';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClinet';

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant={'small'}>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values) => {
          console.log('email', values.email);

          await forgotPassword({ email: values.email });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>Please check your email..</Box>
          ) : (
            <Form>
              <InputFeild
                label='email'
                name='email'
                type='email'
                placeholder='email'
              ></InputFeild>
              <Button
                isLoading={isSubmitting}
                mt={4}
                colorScheme='teal'
                type={'submit'}
              >
                Forgot Password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
