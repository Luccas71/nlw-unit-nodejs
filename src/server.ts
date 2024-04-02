import fastify from "fastify"


// Métodos HTTP: GET, POST, PUT, DELETE, PATCH, HEADER, OPTIONS

// Corpo da Requisição (Request Body)
// Parametros de busca (Search Params / Query Params) `http://localhost:3333/users?name=Lucas`
// Parametros de rota (Route Params) -> identificação de recursos `DELETE http://localhost:3333/users/3`
// Cabeçalho (Headers) = Contexto 

// Semantica = significado

const app = fastify()

app.listen({ port: 3333 }).then(() => {
    console.log("HTTP Server is running!")
})