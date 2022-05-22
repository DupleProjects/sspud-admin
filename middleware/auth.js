// https://nuxtjs.org/docs/directory-structure/middleware/
export default async function ({store, redirect, route}) {
    const userIsLoggedIn = !!store.state.auth.user
    const path = route.path;

    // const noAuthRoutes = ["/register","/login","/reset","/forgot"];
    //
    // if(!userIsLoggedIn)
    // {
    //     if(!noAuthRoutes.includes(path))
    //     {
    //         return redirect('/login')
    //     }
    // }
    // else if(userIsLoggedIn && noAuthRoutes.includes(path)){
    //     return redirect('/');
    // }
    
    return Promise.resolve()
  }
