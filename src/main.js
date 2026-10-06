import { HttpClient } from "./shared/infrastructure/HttpClient.js";
const users = await HttpClient('https://jsonplaceholder.typicode.com/users');
console.log(users);