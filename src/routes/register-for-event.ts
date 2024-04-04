import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function registerForEvent(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/events/:eventId/attendees', {
            schema: {
                body: z.object({
                    name: z.string().min(4),
                    email: z.string().email(),
                }),
                params: z.object({
                    eventId: z.string().uuid(),
                }),
                response: {
                    201: z.object({
                        attendeeId: z.number(),
                    })
                }
            }
        }, async (request, reply) => {
            const { eventId } = request.params
            const { name, email } = request.body

            const attendeefromEmail = await prisma.attendee.findUnique({
                where: {
                    eventId_email: {
                        eventId,
                        email
                    }
                }
            })

            // vai executar as querys em paralelo (mesmo tempo)
            const [event, amountOfNumberAttendeeForEvent] = await Promise.all([
                prisma.event.findUnique({
                    where: {
                        id: eventId,
                    }
                }),

                prisma.attendee.count({
                    where: {
                        eventId,
                    }
                }) 
            ])
            if (attendeefromEmail !== null) {
                throw new Error('This email is already registered for this event.')
            }

            if (event?.maximumAttendees && amountOfNumberAttendeeForEvent >= event?.maximumAttendees) {
                throw new Error ('The maximum number of attendees for thid event has been reached.')
            }

            const attendee = await prisma.attendee.create({
                data: {
                    name,
                    email, 
                    eventId
                }
            })

            return reply.status(201).send({ attendeeId: attendee.id })
        })
}