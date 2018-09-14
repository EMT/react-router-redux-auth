// @flow
import React from 'react'
import type { ComponentType } from 'react'
import type { TypeLocation } from '../types'
import { Route, Redirect } from 'react-router-dom'

type TypeProps = {
    component: ComponentType<{ [key: string]: any }>,
    redirect: boolean,
    redirectTo: string | TypeLocation | ( location: TypeLocation ) => string | TypeLocation,
}

const ConditionalRedirect = ( {
    component: Component,
    redirect,
    redirectTo,
    ...rest
}: TypeProps ) => (
    <Route
        { ...rest }
        render={
            ( props ) => {
                let redirectLocation = {}

                if ( redirect ) {
                    let redirectUrl = ( typeof redirectTo === 'function' ) ?
                        redirectTo( props.location ) :
                        redirectTo

                    if ( !redirectUrl ) {
                        throw new Error( 'redirectTo is empty or returned nothing.' )
                    }

                    if ( typeof redirectUrl === 'string' ) {
                        redirectLocation.pathname = redirectUrl
                        redirectLocation.state = { from: props.location }
                    }
                    else {
                        redirectLocation = redirectUrl
                    }
                }

                return (
                    !redirect ?
                        <Component { ...props } /> :
                        <Redirect to={ redirectLocation } />
                )
            }
        }
    />
)

export default ConditionalRedirect
