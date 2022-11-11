export const ROUTES = {
  LOGIN: '/login',
  REGISTRATION: '/registration',
  HOME: '/',
  FORGOT_PASSWORD: '/forgot-password',
  CREATE_POST: '/create-post',
  POST: (id: number) => `/post/${id}`,
  EDIT_POST: (id: number) => `/post/edit/${id}`
};
