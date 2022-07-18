import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
} from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:8080/modules/graphql",
  credentials: "include",
  fetchOptions: {
    mode: "cors",
  },
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: "Basic " + btoa("root:root1234"),
      referer: "http://localhost:8080",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

client
  .query({
    query: gql`
      query {
        admin {
          jahia {
            version {
              release
              build
            }
          }
        }
      }
    `,
  })
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
