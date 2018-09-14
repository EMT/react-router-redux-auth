// @flow
import React from 'react'
import type { ComponentType } from 'react'
import type { TypeLocation } from '../types'
import { withRouter } from 'react-router-dom'
import { withAuth } from '@fieldwork/redux-auth'
import ConditionalRedirect from './ConditionalRedirect'

type TypeProps = {
    component: ComponentType<{ [key: string]: any }>,
    redirectTo: string | ( authUser: {}, redirectUrl: ?string ) => string,
    ignoreStateLocation: boolean,

    // from router
    location: ?TypeLocation,

    // from withAuth
    auth: {
        hasSucceeded: boolean,
        user: {},
    },
}

const defaultProps = {
    ignoreStateLocation: false,
}

const RedirectAuthenticated = ( {
    component,
    location,
    auth,
    redirectTo,
    ignoreStateLocation,
    ...rest
}: TypeProps ) => {
    const redirectUrl = ( redirectTo, ignoreStateLocation ) => ( location: TypeLocation ) => {
        let redirectUrl

        if ( !ignoreStateLocation ) {
            redirectUrl = location && location.state && location.state.from ?
                location.state.from :
                null
        }

        if ( !redirectUrl ) {
            redirectUrl = ( typeof redirectTo === 'function' ) ?
                redirectTo( auth.user, redirectUrl ) :
                redirectTo
        }

        return redirectUrl
    }

    return (
        <ConditionalRedirect
            component={ component }
            redirect={ !!auth.hasSucceeded }
            redirectTo={ redirectUrl( redirectTo, ignoreStateLocation ) }
            { ...rest }
        />
    )
}

RedirectAuthenticated.defaultProps = defaultProps

export default withRouter( withAuth( RedirectAuthenticated ) )
