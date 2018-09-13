// @flow
import React from 'react'
import type { ComponentType } from 'react'
import { Route, Redirect } from 'react-router-dom'

type TypeProps = {
    component: ComponentType<{ [key: string]: any }>,
    redirect: boolean,
    redirectTo: string,
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
            ( props ) => (
                !redirect ?
                    <Component { ...props } /> :
                    <Redirect
                        to={ {
                            pathname: redirectTo,
                            state: { from: props.location },
                        } }
                    />
            )
        }
    />
)

export default ConditionalRedirect
