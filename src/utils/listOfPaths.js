const routes = [];
const printRoutes= function(app){
  app._router.stack.forEach(function (layer) {
    if (layer.route) {
      // Route middleware
      routes.push(layer.route);
    } else if (layer.name === "router") {
      // Subrouter middleware
      layer.handle.stack.forEach(function (sublayer) {
        routes.push(sublayer.route);
      });
    }
  });
  console.log("----------Available Endpoints----------------");
  // Print the list of routes
  routes.forEach(function (route) {
    console.table([route.path]);
  });

  console.log("----------------------------------------------")
}



export {printRoutes}

