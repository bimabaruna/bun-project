import type { User } from "@prisma/client"

export type ApplicationVariables = {
    user: User
    // users: Object
}