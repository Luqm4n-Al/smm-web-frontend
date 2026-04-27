'use client'

import { ApolloProvider as ApolloHooksProvider } from "@apollo/client/react"
import { apolloClient } from "./apollo-client" // ganti dari "./client"

export function ApolloProvider({ children }: { children: React.ReactNode }) {
    return (
        <ApolloHooksProvider client={apolloClient}>
            {children}
        </ApolloHooksProvider>
    )
}