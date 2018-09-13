import React from 'react'
import renderer from 'react-test-renderer'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import { authReducer } from '@fieldwork/redux-auth'
import RedirectUnauthenticated from './RedirectUnauthenticated'

const store = createStore( combineReducers( { auth: authReducer } ) )
const TestPrivateComponent = () => <div>This is private.</div>
const expected = ['This is private.']

describe( 'RedirectUnauthenticated component', () => {
    test( 'renders component when auth.hasFailed is null', () => {
        const component = renderer.create(
            <StaticRouter location="/private" context={ {} }>
                <Provider store={ store }>
                    <RedirectUnauthenticated
                        path="/private"
                        component={ TestPrivateComponent }
                        redirectTo="/login"
                    />
                </Provider>
            </StaticRouter>,
        )

        const tree = component.toJSON()
        expect( tree.children ).toEqual( expected )
    } )

    test( 'renders component when auth.hasFailed is false', () => {
        const component = renderer.create(
            <StaticRouter location="/private" context={ {} }>
                <Provider store={ store }>
                    <RedirectUnauthenticated
                        path="/private"
                        component={ TestPrivateComponent }
                        redirectTo="/login"
                    />
                </Provider>
            </StaticRouter>,
        )

        store.dispatch( { type: 'AUTH_SET_SUCCEEDED' } )

        const tree = component.toJSON()
        expect( tree.children ).toEqual( expected )
    } )

    test( 'renders Redirect when auth.hasFailed is true', () => {
        const component = renderer.create(
            <StaticRouter location="/private" context={ {} }>
                <Provider store={ store }>
                    <RedirectUnauthenticated
                        path="/private"
                        component={ TestPrivateComponent }
                        redirectTo="/login"
                    />
                </Provider>
            </StaticRouter>,
        )

        store.dispatch( { type: 'AUTH_SET_FAILED' } )

        const tree = component.toJSON()
        expect( tree ).toBe( null )
    } )
} )
