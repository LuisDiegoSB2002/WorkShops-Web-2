const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

// Definir el esquema GraphQL
const schema = buildSchema(`
  type Teacher {
    id: ID!
    name: String!
    age: Int!
    courses: [Course!]!
  }

  type Course {
    id: ID!
    title: String!
    description: String!
    teacher: Teacher!
  }

  type Query {
    teachers: [Teacher!]!
    courses: [Course!]!
  }
`);

const teachers = [
  { id: '1', name: 'John Doe', age: 30, courses: ['1', '2'] },
  { id: '2', name: 'Jane Smith', age: 28, courses: ['3'] },
];

const courses = [
  { id: '1', title: 'Math', description: 'Introduction to Math', teacher: '1' },
  { id: '2', title: 'Science', description: 'Basic Science Concepts', teacher: '1' },
  { id: '3', title: 'History', description: 'World History Overview', teacher: '2' },
];

const resolvers = {
  Query: {
    teachers: () => teachers,
    courses: () => courses,
  },
  Teacher: {
    courses: (parent) => courses.filter((course) => parent.courses.includes(course.id)),
  },
  Course: {
    teacher: (parent) => teachers.find((teacher) => teacher.id === parent.teacher),
  },
};


app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));


const port = 3000;
app.listen(port, () => {
  console.log(`Servidor GraphQL listo en http://localhost:${port}/graphql`);
});