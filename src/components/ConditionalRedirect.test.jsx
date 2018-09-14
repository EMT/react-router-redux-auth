import React from 'react'
import renderer from 'react-test-renderer'
import { StaticRouter } from 'react-router-dom'
import ConditionalRedirect from './ConditionalRedirect'

const TestComponent = () => <div>This is a test.</div>
const expected = [ 'This will ony render when not authenticated.' ]

describe( 'ConditionalRedirect component', () => {
    test( 'throws when asked to redirect without a `redirectTo` value', () => {
        expect.assertions( 1 )
        spyOn( console, 'error' )

        try {
            const component = renderer.create(
                <StaticRouter location="/somewhere" context={ {} }>
                    <ConditionalRedirect
                        path="/somewhere"
                        component={ TestComponent }
                        redirect
                        redirectTo={ () => null }
                    />
                </StaticRouter>,
            )
        }
        catch( e ) {
            expect( e.message ).toBe( 'redirectTo is empty or returned nothing.' )
        }
    } )
} )
