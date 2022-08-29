import * as z from "zod"

export const pushNotificationsModel = z.object({
  id: z.string(),
  explorer: z.string(),
  active: z.boolean().nullish(),
})
