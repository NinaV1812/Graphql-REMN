const express = require("express");
const app = express();
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const bodyParser = require("body-parser");
const { buildSchema } = require("graphql");
const expressPlayground =
  require("graphql-playground-middleware-express").default;
const { mongoose } = require("mongoose");

app.use(bodyParser.json());
app.get("/playground", expressPlayground({ endpoint: "/graphql" }));
const User = require("./models/user");
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only requests from your React app
    methods: ["GET", "POST", "OPTIONS"], // Allow these methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
    credentials: true, // Include cookies if necessary
  })
);
app.options("*", cors()); // Preflight requests
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type RootQuery {
          user(id: ID!): User!
        }

        type RootMutation {
        addUser(userInput:UserInput): User!
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

        schema {
        query: RootQuery
        mutation: RootMutation 
        }
        `),
    rootValue: {
      user: async (args) => {
        try {
          const user = await User.findOne({ _id: args.id });
          return { ...user._doc };
        } catch (error) {
          throw error;
        }
      },
      addUser: async (args) => {
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
    graphiql: true,
  })
);

const PORT = process.env.PORT || 5001;
mongoose
  .connect(
    `mongodb+srv://graphqluser:Testing123@cluster0.lex5qg3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {})
  .catch((err) => {
    console.log(err);
  });
app.listen(PORT, () => {
  console.log(`Running running on port ${PORT}`);
});
