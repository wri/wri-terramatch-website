import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import { useLogout } from "@/hooks/logout";

export default function Custom500() {
  const logout = useLogout();

  const handleBackToHome = () => {
    try {
      logout();
    } catch (e) {
      window.location.replace("/");
    }
  };

  return (
    <PageBody className="flex flex-col items-center justify-center px-4 sx:px-15">
      <div className="w-full max-w-3xl rounded-lg border-neutral-100 bg-white py-15 px-8 sx:px-15">
        <Text as="h1" variant="text-bold-headline-1000" className="text-center">
          500
        </Text>
        <Text as="h1" variant="text-bold-headline-1000" className="text-center">
          Internal Server Error
        </Text>
        <Text variant="text-light-subtitle-400" className="my-8 text-center">
          Please try again later or or get in touch with TerraMatch support if the issue continues.
        </Text>
        <Button onClick={handleBackToHome} className="mx-auto">
          Back To Home
        </Button>
      </div>
    </PageBody>
  );
}
