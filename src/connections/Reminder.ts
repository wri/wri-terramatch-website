import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { creationHook } from "@/connections/util/connectionShortcuts";
import { sendReminder, SendReminderPathParams } from "@/generated/v3/entityService/entityServiceComponents";
import { ReminderDto } from "@/generated/v3/entityService/entityServiceSchemas";

export type ReminderEntityType = SendReminderPathParams["entity"];

const reminderCreateConnection = v3Resource("reminders", sendReminder)
  .create<ReminderDto, SendReminderPathParams>(({ entity, uuid }) => ({
    pathParams: { entity, uuid }
  }))
  .buildConnection();

export const useSendReminder = creationHook(reminderCreateConnection);
