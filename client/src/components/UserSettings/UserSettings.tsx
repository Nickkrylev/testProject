import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface UserSettingsFormValues {
  username: string;
  nickname: string;
  email: string;
  phone: string;
}

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UserSettings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false); // Состояние для отображения пароля
  const [isChangePassword, setIsChangePassword] = useState(false); // Состояние для переключения на форму изменения пароля

  // Начальные значения формы
  const initialValues: UserSettingsFormValues = {
    username: "",
    nickname: "",
    email: "",
    phone: "",
  };

  const changePasswordInitialValues: ChangePasswordFormValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  // Схема валидации
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(2, "Username must be at least 2 characters")
      .required("Username is required"),
    nickname: Yup.string()
      .min(2, "Nickname must be at least 2 characters")
      .required("Nickname is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^\d+$/, "Phone number must contain only digits")
      .min(10, "Phone number must be at least 10 digits")
      .required("Phone number is required"),
  });

  const changePasswordValidationSchema = Yup.object({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .min(6, "New password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = (values: UserSettingsFormValues) => {
    console.log("Updated user settings:", values);
    alert("Settings updated successfully!");
  };

  const handleChangePasswordSubmit = (values: ChangePasswordFormValues) => {
    console.log("Change password values:", values);
    alert("Password changed successfully!");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        {/* Кнопка закрытия */}
        <button
  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
  onClick={onClose}
>
  ✖
</button>

        {!isChangePassword ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center">User Settings</h1>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form>
                  <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="username">
                      Username
                    </label>
                    <Field
                      type="text"
                      id="username"
                      name="username"
                      className="w-full px-4 py-2 border rounded"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="nickname">
                      Nickname
                    </label>
                    <Field
                      type="text"
                      id="nickname"
                      name="nickname"
                      className="w-full px-4 py-2 border rounded"
                    />
                    <ErrorMessage
                      name="nickname"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="email">
                      Email
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border rounded"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="phone">
                      Phone
                    </label>
                    <Field
                      type="text"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-2 border rounded"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <button
                    type="button"
                    className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 mt-4"
                    onClick={() => setIsChangePassword(true)}
                  >
                    Change Password
                  </button>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4"
                  >
                    Save Changes
                  </button>
                </Form>
              )}
            </Formik>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center">
              Change Password
            </h1>
            <Formik
              initialValues={changePasswordInitialValues}
              validationSchema={changePasswordValidationSchema}
              onSubmit={handleChangePasswordSubmit}
            >
              {({ values }) => (
                <Form>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700"
                      htmlFor="currentPassword"
                    >
                      Current Password
                    </label>
                    <Field
                      type={showPassword ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      className="w-full px-4 py-2 border rounded"
                    />
                    <ErrorMessage
                      name="currentPassword"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="newPassword">
                      New Password
                    </label>
                    <Field
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      className="w-full px-4 py-2 border rounded"
                    />
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-700"
                      htmlFor="confirmPassword"
                    >
                      Confirm Password
                    </label>
                    <Field
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      className="w-full px-4 py-2 border rounded"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                      />
                      <span>Show Password</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4"
                  >
                    Update Password
                  </button>

                  <button
                    type="button"
                    className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 mt-4"
                    onClick={() => setIsChangePassword(false)}
                  >
                    Back
                  </button>
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
    </div>
  );
};

export default UserSettings;
