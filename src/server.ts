import fastify from "fastify"
import { z } from "zod"
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod" 
import { PrismaClient } from '@prisma/client'
import { generateSlug } from "./utils/generate-slug"
import { createEvent } from "./routes/create-event"
import { registerForEvent } from "./routes/register-for-event"
import { getEvent } from "./routes/get-event"

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// usando a rota criada
app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)

app.listen({ port: 3333 }).then(() => {
    console.log("HTTP Server is running!")
})