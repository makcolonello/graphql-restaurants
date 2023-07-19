var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var restaurants = [
    {
        "name": "The Flower Kitchen",
        "description": "Exceptional flowers, coffee, and food",
        "dishes": [
            {
                "name": "Lemon Poppyseed Scone",
                "price": 3
            },
            {
                "name": "Maple Cinnamon Latte",
                "price": 5
            }
        ]
    },
    {
        "name": "The Frothy Monkey ",
        "description": "Nashville's favorite local coffee shop",
        "dishes": [
            {
                "name": "Vanilla Cinnamon Brioche French Toast",
                "price": 14
            },
            {
                "name": "Salty Siren",
                "price": 6
            }
        ]
    },
    {
        "name": "Slow Hands + Bakeshop",
        "description": "Specialty coffee shop, bakery, and brunch spot",
        "dishes": [
            {
                "name": "Pecan Shortbread Cookie",
                "price": 4
            },
            {
                "name": "Bourbon Vanilla Latte",
                "price": 5
            }
        ]
    }
]

var schema = buildSchema(`
type Query {
    restaurant(id: Int): restaurant
    restaurants: [restaurant]
},
type restaurant {
    id: Int
    name: String
    description: String
    dishes: [Dish]
},
type Dish {
    name: String
    price: Int
},
input restaurantInput {
    name: String
    description: String
},
type DeleteResponse{
    ok: Boolean
},
type Mutation {
    setrestaurant(input: restaurantInput): restaurant
    deleterestaurant(id: Int!): DeleteResponse
    editrestaurant(id: Int!, name: String!): restaurant
}`);

// the root provides a resolver function for each API endpoint
var root = {
    restaurant : (arg) => restaurants[arg.id],
    restaurants : () => restaurants,
    setrestaurant : ({input}) => {
        restaurants.push({name:input.name, description:input.description})
        return input
    },
    deleterestaurant : ({id}) => {
        const ok = Boolean(restaurants[id])
        let delc = restaurants[id];
        restaurants = restaurants.filter(item => item.id !== id)
        console.log(JSON.stringify(delc))
        return {ok}
    },
    editrestaurant: ({id, ...restaurant}) => {
        if(!restaurants[id]) {
            throw new Error("restaurant doesn't exist")
        }
        restaurants[id] = {
            ...restaurants[id],...restaurant
        }
        return restaurants[id]
    }
    };


var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000, () => console.log('Running Graphql on Port: 4000'));