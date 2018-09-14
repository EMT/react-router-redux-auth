// @flow

export type TypeLocation = {
    state: ?{
        from: ?{
            [key: string]: any,
            pathname: ?string,
        },
    },
}
