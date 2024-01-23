import homePage from "./pages/home.js";
import aboutPage from "./pages/about.js";
import aboutMePage from "./pages/about-me.js";
import aboutMe2Page from "./pages/about-me-2.js";
import aboutMe3Page from "./pages/about-me-3.js";
import contactUsPage from "./pages/contactUs.js";
import notFoundPage from "./pages/404.js";
import postPage from "./pages/post.js";

export const routes = [
    {
        path: '/',
        component: homePage,
        title: 'Home',
        beforeRouteEnter(from, to) {
            console.log(to, from, 'in component guard Enter')
        },
        beforeRouteLeave(from, to) {
            console.log(to, from, 'in component guard Leave')
        },
        meta: {
            additionalData: true
        }
    },
    {
        path: '/about',
        component: aboutPage,
        title: 'About',
        meta: {
            additionalData: true
        },
        children: [
            {
                path: '/about-me',
                component: aboutMePage,
                title: 'Post',
                children: [
                    {
                        path: '/about-me-2',
                        component: aboutMe2Page,
                        title: 'Post',
                    },
                    {
                        path: '/about-me-3',
                        component: aboutMe3Page,
                        title: 'Post',
                    }
                ]
            }
        ]
    },
    {
        path: '/contact-us',
        component: contactUsPage,
        title: 'Contact Us',
        beforeRouteEnter(from, to) {
            console.log(to, from, 'in component guard Enter')
        },
        beforeRouteLeave(from, to) {
            console.log(to, from, 'in component guard Leave')
        },
        meta: {
            additionalData: true
        }
    },
    {
        path: '/posts/:id/router/:number',
        component: postPage,
        title: 'Post',
        beforeRouteUpdate (from, to) {
            console.log(to, from, 'in component guard Update')
        },
        meta: {
            additionalData: true
        }
    },

    {
        path: '/posts/:id',
        component: postPage,
        title: 'Post',
        beforeRouteUpdate (from, to) {
            console.log(to, from, 'in component guard Update')
        },
        meta: {
            additionalData: true
        }
    },

    {
        path: '/posts/test',
        component: postPage,
        title: 'Post',
        beforeRouteUpdate (from, to) {
            console.log(to, from, 'in component guard Update')
        },
        meta: {
            additionalData: true
        }
    },
    {
        path: '404',
        component: notFoundPage,
        title: '404'
    }
]

export default routes;