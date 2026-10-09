import { UserModule } from "./features/user/UserModule.js";

document.addEventListener('DOMContentLoaded', () => {
    try {
        //Initialize user module
        const userFeature = UserModule();
        userFeature.init();
    } catch (error) {
        console.error("[Main Error]: ", error);
        document.body.innerHTML = '<h2>Application failed to Load.</h2>'
    }
});


// const users = await HttpClient('https://jsonplaceholder.typicode.com/users');
// console.log(users);