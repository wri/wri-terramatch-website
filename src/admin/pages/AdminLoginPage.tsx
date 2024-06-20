import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useLogin, useNotify } from "react-admin";
import { useForm } from "react-hook-form";

import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import Form from "@/components/extensive/Form/Form";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import { LoginFormDataSchema, LoginFormDataType } from "@/pages/auth/login/index.page";

const AdminLoginPage = () => {
  const login = useLogin();
  const notify = useNotify();

  const form = useForm<LoginFormDataType>({
    resolver: yupResolver(LoginFormDataSchema),
    mode: "all"
  });

  const handleSave = async ({ email, password }: LoginFormDataType) => {
    try {
      await login({ username: email, password });
    } catch (err) {
      notify("Invalid email or password");
    }
  };

  const {
    formState: { errors }
  } = form;

  return (
    <main className="flex min-h-screen">
      <BackgroundLayout>
        <ContentLayout>
          <Form>
            <Form.Header title="Admin Login" subtitle="Sign in to Admin Panel." />
            {/* Inputs */}
            <Input name="email" formHook={form} error={errors.email} type="text" label={"Email"} required />
            <Input
              name="password"
              formHook={form}
              error={errors.password}
              type="password"
              label={"Password"}
              required
            />
            <div className="mt-6 flex items-center justify-center">
              <Link href="/admin/auth/reset-password">
                <Text variant="text-body-600" className="uppercase underline">
                  Reset password
                </Text>
              </Link>
            </div>
            <Form.Footer
              primaryButtonProps={{
                children: "Sign in",
                onClick: form.handleSubmit(handleSave)
              }}
            />
          </Form>
        </ContentLayout>
      </BackgroundLayout>
    </main>
  );
};

export default AdminLoginPage;
