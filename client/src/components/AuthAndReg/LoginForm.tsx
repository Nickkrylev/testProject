import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../../API/auth';
// Если вы используете react-router-dom:
import { Link ,useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const initialValues = {
    identifier: '', // Can be email or phone
    password: '',
  };
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    identifier: Yup.string()
      .matches(
        /^([+]?\d{1,14}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
        'Must be a valid email or phone number'
      )
      .required('Email or phone is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await loginUser(values);
      alert('Login Successful');
      console.log('Server response:', response);
      
      // Если сервер присылает token:
    

      // Если сервер присылает данные пользователя (к примеру, { user: {...} }):
  
      sessionStorage.setItem('user', JSON.stringify(response));
      // history.push('/dashboard');
      navigate('/dashboard');
      window.location.reload();
      // Далее можно сделать редирект или другую логику
      // history.push('/dashboard'); // если используется react-router
    } catch (error: any) {
      console.error('Login failed:', error);
      alert(`Login failed: ${error.message}`);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-slate-800">
            Login
          </h2>

          {/* Identifier (email or phone) */}
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-slate-700">
              Email or Phone
            </label>
            <Field
              id="identifier"
              name="identifier"
              type="text"
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                invalid:border-pink-500 invalid:text-pink-600
                focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
            />
            <ErrorMessage
              name="identifier"
              component="div"
              className="text-sm text-red-600 mt-1"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <Field
              id="password"
              name="password"
              type="password"
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                invalid:border-pink-500 invalid:text-pink-600
                focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-sm text-red-600 mt-1"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          {/* Ссылка на регистрацию */}
          <p className="text-center">
            No acount?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800"
            >
              Registration
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
