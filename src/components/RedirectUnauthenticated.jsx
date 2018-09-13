// @flow
import React from 'react'
import type { ComponentType } from 'react'
import { withAuth } from '@fieldwork/redux-auth'
import ConditionalRedirect from './ConditionalRedirect'

type TypeProps = {
    component: ComponentType<{ [key: string]: any }>,
    redirectTo: string,

    // from withAuth
    auth: {
        hasFailed: boolean,
    },
}

const RedirectUnauthenticated = ( {
    component,
    auth,
    redirectTo,
    ...rest
}: TypeProps ) => (
    <ConditionalRedirect
        component={ component }
        redirect={ auth.hasFailed }
        redirectTo={ redirectTo }
        { ...rest }
    />
)

export default withAuth( RedirectUnauthenticated )
