const routes = [
    {
        path: "/",
        name: "about",
        component: About
    },
    {
        path: "/test/:question",
        name: "test",
        component: Test
    },
    {
        path: "/report",
        name: "report",
        component: Report
    }
];

const router = new VueRouter({
    routes: routes
});

const app = new Vue({
    el: "#app",
    router: router
});
