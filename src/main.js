import { httpClient } from "./shared/infrastructure/httpClient.js";
const result = await httpClient(
    { url: "https://jsonplaceholder.typicode.com/users" }
);
console.log(result);