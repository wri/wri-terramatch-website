import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

import SignupConfirmPage from "@/pages/auth/reset-password/confirm.page";

const AdminResetPasswordConfirmPage = ({ email }: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <div className="flex h-screen flex-col">
    <SignupConfirmPage email={email} />
  </div>
);

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const email = ctx.query.email;

  let options = {};
  if (!email)
    options = {
      redirect: {
        permanent: false,
        destination: "/admin/auth/reset-password"
      }
    };

  return {
    ...options,
    props: {
      email: email as string
    }
  };
};

export default AdminResetPasswordConfirmPage;
