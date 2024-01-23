import createRoute, { useRoute } from './router/router.js';
import routes from './routes.js';


function guard(from, to, next) {
   const route = useRoute();
   console.log(route.routeData(), 'guard route use rote');

   // if (to === '/contact-us') {
   //    return next('/');
   // }
   return next();
}


createRoute(routes, 'historyMode', guard);