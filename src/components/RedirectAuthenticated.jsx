// @flow
import React from 'react'
import type { ComponentType } from 'react'
import { withAuth } from '@fieldwork/redux-auth'
import ConditionalRedirect from './ConditionalRedirect'

type TypeProps = {
    component: ComponentType<{ [key: string]: any }>,
    location: ?{
        state: ?{
            from: ?{
                pathname: ?string,
            },
        },
    },
    redirectTo: string | ( authUser: {}, redirectUrl: ?string ) => string,
    skipStateLocation: boolean,

    // from withAuth
    auth: {
        hasSucceeded: boolean,
        user: {},
    },
}

const defaultProps = {
    skipStateLocation: false,
}

const RedirectAuthenticated = ( {
    component,
    location,
    auth,
    redirectTo,
    skipStateLocation,
    ...rest
}: TypeProps ) => {
    let redirectUrl

    if ( !skipStateLocation ) {
        redirectUrl = location && location.state && location.state.from ?
            location.state.from.pathname :
            null
    }

    if ( !redirectUrl ) {
        redirectUrl = ( typeof redirectTo === 'function' ) ?
            redirectTo( auth.user, redirectUrl ) :
            redirectTo
    }

    return (
        <ConditionalRedirect
            component={ component }
            redirect={ !!auth.hasSucceeded }
            redirectTo={ redirectUrl }
            { ...rest }
        />
    )
}

RedirectAuthenticated.defaultProps = defaultProps

export default withAuth( RedirectAuthenticated )
