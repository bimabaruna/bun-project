import { toContactResponse, type ContactResponse, type CreateContactRequest } from "../model/contact-model";
import type { Contact, User } from '@prisma/client';
import { contactValidation } from "../validation/contact-validation";
import { prismaClient } from "../application/database";
import { HTTPException } from "hono/http-exception";

export class ContactService {

    static async create(user: User, request: CreateContactRequest): Promise<ContactResponse> {

        request = contactValidation.CREATE.parse(request)

        const isContactExist = await prismaClient.contact.count({
            where: {
                user_id: user.id
            }
        })

        if (isContactExist != 0) {
            throw new HTTPException(400, {
                message: "Contact is already exists for this user"
            })
        }

        const contact = await prismaClient.contact.create({
            data: {
                user_id: user.id,
                first_name: request.first_name, // required field
                last_name: request.last_name,   // optional
                email: request.email,           // optional
                phone: request.phone           // optional
            }
        })

        return toContactResponse(contact)
    }

    static async get(user: User, contactId : number): Promise<ContactResponse>{

        contactId = contactValidation.GET.parse(contactId)

        const contact = await prismaClient.contact.findFirst({
            where:{
                user_id: user.id
            }
        })

        if (!contact) {
            throw new HTTPException(400,{
                message: 'contact not found'
            })
        }

        return toContactResponse(contact)
    }
} 