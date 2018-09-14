import React from 'react'
import renderer from 'react-test-renderer'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { StaticRouter, MemoryRouter, Route } from 'react-router-dom'
import { authReducer } from '@fieldwork/redux-auth'
import RedirectAuthenticated from './RedirectAuthenticated'
import RedirectUnauthenticated from './RedirectUnauthenticated'

const TestComponent = () => <div>This is a test.</div>
const expected = [ 'This is a test.' ]
let store

beforeEach( () => {
    store = createStore( combineReducers( { auth: authReducer } ) )
} )

describe( 'RedirectAuthenticated component', () => {
    test( 'renders component when auth.hasSucceeded is null', () => {
        const component = renderer.create(
            <StaticRouter location="/login" context={ {} }>
                <Provider store={ store }>
                    <RedirectAuthenticated
                        path="/login"
                        component={ TestComponent }
                        redirectTo="/private"
                    />
                </Provider>
            </StaticRouter>,
        )
        // store.dispatch( { type: 'AUTH_SET_SUCCEEDED' } )
        const tree = component.toJSON()
        expect( tree.children ).toEqual( expected )
    } )

    test( 'renders component when auth.hasSucceeded is false', () => {
        const component = renderer.create(
            <StaticRouter location="/login" context={ {} }>
                <Provider store={ store }>
                    <RedirectAuthenticated
                        path="/login"
                        component={ TestComponent }
                        redirectTo="/private"
                    />
                </Provider>
            </StaticRouter>
        )

        store.dispatch( { type: 'AUTH_SET_FAILED' } )

        const tree = component.toJSON()
        expect( tree.children ).toEqual( expected )
    } )

    test( 'redirects when auth.hasSucceeded is true', () => {
        const component = renderer.create(
            <StaticRouter location="/login" context={ {} }>
                <Provider store={ store }>
                    <RedirectAuthenticated
                        path="/login"
                        component={ TestComponent }
                        redirectTo="/private"
                    />
                </Provider>
            </StaticRouter>
        )

        store.dispatch( { type: 'AUTH_SET_SUCCEEDED' } )

        const tree = component.toJSON()
        expect( tree ).toEqual( null )
    } )

    test( 'uses `location.state.from` as the redirect location.', () => {
        let loc

        const component = renderer.create(
            <MemoryRouter initialEntries={ ['/this-is-private'] }>
                <Provider store={ store }>
                    <div>
                        <RedirectUnauthenticated
                            path="/this-is-private"
                            component={ ( { location } ) => {
                                // console.log( 'this is private component' )
                                loc = location
                                return <p>This is private</p>
                            } }
                            redirectTo="/login"
                        />
                        <RedirectAuthenticated
                            path="/login"
                            component={ ( { location } ) => {
                                // console.log( 'login component' )
                                loc = location
                                return <p>Login</p>
                            } }
                            redirectTo="/some-other-place"
                        />
                        <Route
                            path="/some-other-place"
                            render={ ( { location } ) => {
                                // console.log( 'other place component ' )
                                loc = location
                                return <p>We should never be here</p>
                            } }
                        />
                    </div>
                </Provider>
            </MemoryRouter>,
        )

        let tree = component.toJSON()
        expect( tree.children[0].children ).toEqual( [ 'This is private' ] )

        store.dispatch( { type: 'AUTH_SET_FAILED' } )
        tree = component.toJSON()
        expect( tree.children[0].children ).toEqual( [ 'Login' ] )

        store.dispatch( { type: 'AUTH_SET_SUCCEEDED' } )
        tree = component.toJSON()
        expect( tree.children[0].children ).toEqual( [ 'This is private' ] )
    } )

    test( 'doesn’t use `location.state.from.pathname` when `ignoreStateLocation` is true.', () => {
        let loc

        const component = renderer.create(
            <MemoryRouter initialEntries={ ['/this-is-private'] }>
                <Provider store={ store }>
                    <div>
                        <RedirectUnauthenticated
                            path="/this-is-private"
                            component={ ( { location } ) => {
                                // console.log( 'this is private component' )
                                loc = location
                                return <p>This is private</p>
                            } }
                            redirectTo="/login"
                        />
                        <RedirectAuthenticated
                            path="/login"
                            component={ ( { location } ) => {
                                // console.log( 'login component' )
                                loc = location
                                return <p>Login</p>
                            } }
                            redirectTo="/some-other-place"
                            ignoreStateLocation
                        />
                        <Route
                            path="/some-other-place"
                            render={ ( { location } ) => {
                                // console.log( 'other place component ' )
                                loc = location
                                return <p>We should arrive here</p>
                            } }
                        />
                    </div>
                </Provider>
            </MemoryRouter>,
        )

        let tree = component.toJSON()
        expect( tree.children[0].children ).toEqual( [ 'This is private' ] )

        store.dispatch( { type: 'AUTH_SET_FAILED' } )
        tree = component.toJSON()
        expect( tree.children[0].children ).toEqual( [ 'Login' ] )

        store.dispatch( { type: 'AUTH_SET_SUCCEEDED' } )
        tree = component.toJSON()
        expect( tree.children[0].children ).toEqual( [ 'We should arrive here' ] )
    } )

    test( 'uses `redirectTo` when there’s no `location.state.from.pathname`.', () => {
        let loc

        const component = renderer.create(
            <MemoryRouter initialEntries={ ['/login'] }>
                <Provider store={ store }>
                    <div>
                        <RedirectUnauthenticated
                            path="/this-is-private"
                            component={ ( { location } ) => {
                                // console.log( 'this is private component' )
                                loc = location
                                return <p>This is private</p>
                            } }
                            redirectTo="/login"
                        />
                        <RedirectAuthenticated
                            path="/login"
                            component={ ( { location } ) => {
                                // console.log( 'login component' )
                                loc = location
                                return <p>Login</p>
                            } }
                            redirectTo="/some-other-place"
                            ignoreStateLocation
                        />
                        <Route
                            path="/some-other-place"
                            render={ ( { location } ) => {
                                // console.log( 'other place component ' )
                                loc = location
                                return <p>We should arrive here</p>
                            } }
                        />
                    </div>
                </Provider>
            </MemoryRouter>,
        )

        let tree = component.toJSON()
        expect( tree.children[0].children ).toEqual( [ 'Login' ] )

        store.dispatch( { type: 'AUTH_SET_SUCCEEDED' } )
        tree = component.toJSON()
        expect( tree.children[0].children ).toEqual( [ 'We should arrive here' ] )
    } )

    test( 'redirects to a path returned by `redirectTo` when it’s a function', () => {
        const redirectTo = ( user => `/users/${ user.username }/dashboard` )

        const component = renderer.create(
            <MemoryRouter initialEntries={ ['/login'] }>
                <Provider store={ store }>
                    <div>
                        <RedirectAuthenticated
                            path="/login"
                            component={ () => {
                                return <p>Login page.</p>
                            } }
                            redirectTo={ redirectTo }
                        />
                        <Route
                            path="/users/testuser/dashboard"
                            component={ ( { location } ) => {
                                return <p>The user dashboard for testuser.</p>
                            } }
                        />
                    </div>
                </Provider>
            </MemoryRouter>
        )

        store.dispatch( { type: 'AUTH_SET_USER', payload: { username: 'testuser' } } )
        store.dispatch( { type: 'AUTH_SET_SUCCEEDED' } )
        const tree = component.toJSON()
        expect( tree.children[0].children).toEqual( [ 'The user dashboard for testuser.' ] )
    } )
} )
