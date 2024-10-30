const express = require("express");
const cors = require("cors");
const { mongoose, Query } = require("mongoose");
const { ApolloServer, gql } = require("apollo-server-express");
const User = require("./models/user");

const typeDefs = gql`
  type Query {
    user(id: ID!): User!
  }

  type Mutation {
    addUser(userInput: UserInput): User!
  }

  type User {
    _id: ID!
    email: String!
    password: String!
  }

  input UserInput {
    email: String!
    password: String!
  }
`;

const resolvers = {
  Query: {
    user: async (parent, args, context, info) => {
      try {
        const user = await User.findOne({ _id: args.id });
        return { ...user._doc };
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    addUser: async (parent, args, context, info) => {
      try {
        const user = new User({
          email: args.userInput.email,
          password: args.userInput.password,
        });
        const result = await user.save();

        return {
          ...result._doc,
        };
      } catch (error) {
        throw error;
      }
    },
  },
};

// const server = new ApolloServer({ typeDefs, resolvers });
// const app = express();
// server.applyMiddleware({ app });

// const PORT = process.env.PORT || 5001;
// mongoose
//   .connect(
//     `mongodb+srv://graphqluser:Testing123@cluster0.lex5qg3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => {})
//   .catch((err) => {
//     console.log(err);
//   });
// app.listen(PORT, () => {
//   console.log(`Running running on port ${PORT}`);
// });
const PORT = process.env.PORT || 5001;

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start(); // Wait for the server to start
  const app = express();
  server.applyMiddleware({ app });

  mongoose
    .connect(
      `mongodb+srv://graphqluser:Testing123@cluster0.lex5qg3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.log(err);
    });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Call the async function to start the server
startServer();
