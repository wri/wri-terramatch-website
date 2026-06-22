import { Box, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { useMessageValidators } from "@/hooks/useMessageValidations";
import { CheckApprovedIcon, InformationRequiredIcon, RejectedIcon } from "@/redesignComponents/foundations/Icons";
import { ICriteriaCheckItem } from "@/types/validation";

import { getItemSeverity, severityToColor } from "./Modals/validationCriteria";

export type ValidationDetailProps = {
  failedCount: number;
  totalItems: number;
  items: ICriteriaCheckItem[];
};

const ValidationDetail: FC<ValidationDetailProps> = ({ failedCount, totalItems, items }) => {
  const t = useT();
  const { getFormatedExtraInfo } = useMessageValidators();

  return (
    <>
      <Box>
        <Text textStyle="300-bold" color="neutral.900" as="span">
          {t("{failed} out of {total}", { failed: failedCount, total: totalItems })}
        </Text>
        &nbsp;
        <Text textStyle="300" color="neutral.900" as="span">
          {t("Validation criteria are not met")}
        </Text>
      </Box>
      <List.Root gap="0" variant="plain" alignItems="baseline">
        {items.map(item => {
          const severity = getItemSeverity(item);
          const messages = getFormatedExtraInfo(item.extra_info, item.id);
          return (
            <List.Item key={item.id}>
              <List.Indicator asChild color={severityToColor(severity)} boxSize={"max-content"}>
                {severity === "success" ? (
                  <CheckApprovedIcon maxWidth={3} maxHeight={3} />
                ) : severity === "warning" ? (
                  <InformationRequiredIcon maxWidth={3} maxHeight={3} />
                ) : (
                  <RejectedIcon maxWidth={3} maxHeight={3} />
                )}
              </List.Indicator>
              <Box>
                <Text textStyle="300" color="neutral.900">
                  {t(item.label)}
                </Text>
                {messages.length > 0 && (
                  <Box mb={3}>
                    {messages.map((msg, idx) => (
                      <Text textStyle="200" color="neutral.800" key={`${item.id}-${idx}`}>
                        {msg}
                      </Text>
                    ))}
                  </Box>
                )}
              </Box>
            </List.Item>
          );
        })}
      </List.Root>
    </>
  );
};

export default ValidationDetail;
