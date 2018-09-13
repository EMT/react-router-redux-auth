import React from 'react'
import renderer from 'react-test-renderer'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import { authReducer } from '@fieldwork/redux-auth'
import RedirectAuthenticated from './RedirectAuthenticated'

const store = createStore( combineReducers( { auth: authReducer } ) )
const TestComponent = () => <div>This will ony render when not authenticated.</div>
const expected = [ 'This will ony render when not authenticated.' ]

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
                        redirectTo="/login"
                    />
                </Provider>
            </StaticRouter>
        )

        store.dispatch( { type: 'AUTH_SET_FAILED' } )

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
                        redirectTo="/login"
                    />
                </Provider>
            </StaticRouter>
        )

        store.dispatch( { type: 'AUTH_SET_SUCCEEDED' } )

        const tree = component.toJSON()
        expect( tree ).toEqual( null )
    } )
} )
