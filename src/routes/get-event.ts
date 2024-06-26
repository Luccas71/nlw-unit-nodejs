import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { title } from "process";
import { deflate } from "zlib";

export async function getEvent(app: FastifyInstance) {
   app
    .withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId', {
        schema: {
            params: z.object({
                eventId: z.string().uuid(),
            }),
            response: {
                200: z.object({
                    event: z.object({
                        title: z.string(),
                        details: z.string().nullable(),
                        maximumAttendees: z.number().int().nullable(),
                        amountAttendees: z.number().int(),
                    })
                })
            },
        }
    }, async (request, reply) => {
        const { eventId } = request.params

        const event = await prisma.event.findUnique({
            select: {
                title: true,
                details: true,
                maximumAttendees: true,
                _count: {
                    select: {
                        attendees: true,
                    }
                }
            },
            where: {
                id: eventId,
            }
        })

        if (event === null) {
            throw new Error('Event not found.')
        }

        return reply.send({ 
            event: {
                title: event.title,
                details: event.details,
                maximumAttendees: event.maximumAttendees,
                amountAttendees: event._count.attendees
            }
        })
    }) 
}