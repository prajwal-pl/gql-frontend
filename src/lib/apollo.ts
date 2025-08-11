"use client";

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { from } from "@apollo/client/link/core";

const httpAuthLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:8000/graphql",
  fetch: (uri, options) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = new Headers(options?.headers || {});
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(uri, { ...options, headers });
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      // eslint-disable-next-line no-console
      console.error("GraphQL Error:", err.message);
      if (err.extensions?.code === "UNAUTHENTICATED") {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      }
    }
  }
  if (networkError) {
    // eslint-disable-next-line no-console
    console.error("Network Error:", networkError);
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, httpAuthLink]),
  cache: new InMemoryCache(),
});
