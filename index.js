const { GraphQLServer } = require('graphql-yoga'); 


const typeDefs = `
    type Query{
        hello(name: String!):String!
        getUsers:[User]!
        getUser(id: ID!): User!
    }
    type Mutation{
        createUser(name:String!,age:Int!): User!
        updateUser(id:Int!,name:String!,age:Int!):User!
        deleteUser(id:Int!):String!
    }

    type User{
        id:Int!
        name:String!
        age:Int!
    }
`;

const users = [];

const resolvers = {
    Query:{
        hello: (root, params, context, info) => `Hola ${params.name}`,
        getUsers: (root, params, context, info) => users,
        getUser: (root, {id}, context, info) => users.find(u => u.id == id),
    },
    Mutation:{
        createUser: (root, { name,  age}, context, info) => {
            const user = {
                id: users.length + 123214,
                name,
                age,
            };
            users.push(user);
            return user;
        },
        updateUser:(root,{id,name,age},contex,info)=>{
            const user = users.find(u=>u.id === id);
            user.name = name;
            user.age = age;

            const index = users.indexOf(user);
            users[index] = user;

            return user;
        },
        deleteUser:(root,{id},context,info)=>{
            const user = users.find(u=>u.id === id);
            const index = users.indexOf(user);
            
            users.splice(index, 1);
            return `El usuario ${user.name} fue eliminado!`
        }
    },
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(()=>console.log("Servidor arriba en puerto 4000!"))