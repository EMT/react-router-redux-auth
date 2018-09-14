# @fieldwork/react-router-redux-auth

React Router routes that redirect based on whether a user is logged in using [@fieldwork/redux-auth](https://www.npmjs.com/package/@fieldwork/redux-auth).

## API

### `RedirectUnauthenticated`

Redirect an unauthenticated user if `auth.hasFailed` is `true`.

#### Props

##### `component`

A react component to render if the user is authenticated.

##### `redirectTo` (string)

The URL to redirect to if the user is not authenticated.

```
<RedirectUnauthenticated
    path="/my-dashboard"
    component={ MyDashboard }
    redirectTo="/login"
/>
```

### `RedirectAuthenticated`

Redirect an unauthenticated user if `auth.hasSucceeded` is `true`.

#### Props

##### `component`

A react component to render if the user is not authenticated.

##### `redirectTo` (string or function)

The URL to redirect to if the user is authenticated, or a function taking the authenticated user (from `auth.user`) and retuning a URL. Eg:

```
( user, redirectUrl ) => `/users/${ user.id }/dashboard`
```

##### `ignoreStateLocation` (boolean, default: `false`)

If true, the location stored in React Router’s state is ignored. See below.

#### Determining the redirect URL

When the user is authenticated, the URL they’re redirected to is the first of:

- the value of `location.state.from.pathname`
- the value

Setting `ignoreStateLocation` to `true` forces the use of the `redirectTo` prop even when there’s a value in `location.state.from.pathname`.

```
<RedirectAuthenticated
    path="/login"
    component={ LoginPage }
    redirectTo="/my-dashboard"
/>
```
