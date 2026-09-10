const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const typeDefs = require("./esquema");
const resolvers = require("./resolvers");
const { conectar } = require("./db");

async function main() {
  await conectar();
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log("GraphQL escuchando en " + url);
}

main().catch(console.error);