# @fieldwork/react-router-redux-auth

React Router routes that redirect based on where a user is logged in using @fieldwork/redux-auth

## API

### `RedirectUnauthenticated`

Redirect an unauthenticated user if `auth.hasFailed` is `true`.

```
<RedirectUnauthenticated
    path="/my-dashboard"
    component={ MyDashboard }
    redirectTo="/login"
/>
```

### `RedirectAuthenticated`

Redirect an unauthenticated user if `auth.hasSucceeded` is `true`.

```
<RedirectAuthenticated
    path="/login"
    component={ LoginPage }
    redirectTo="/my-dashboard"
/>
```
