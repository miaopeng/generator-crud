import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import { Modal } from 'antd';

export const createCache = () => {
  const cache = new InMemoryCache();
  if (process.env.NODE_ENV === 'development') {
    window.secretVariableToStoreCache = cache;
  }
  return cache;
};

const getTokens = () => {
  // const tokens = {
  //   "X-CSRF-Token": document
  //     .querySelector('meta[name="csrf-token"]')
  //     .getAttribute("content")
  // };
  const tokens = {};
  const authToken = localStorage.getItem('getk');
  return authToken ? { ...tokens, Authorization: authToken } : tokens;
};

const setTokenForOperation = async (operation) =>
  operation.setContext({
    headers: {
      ...getTokens(),
    },
  });

const createLinkWithToken = () =>
  new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle;
        Promise.resolve(operation)
          .then(setTokenForOperation)
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));
        return () => {
          if (handle) handle.unsubscribe();
        };
      }),
  );

// log erors
const logError = (error) => console.error(error);

// create error link
const createErrorLink = () =>
  onError(({ graphQLErrors, networkError, operation }) => {
    let content = '未知错误...';
    if (graphQLErrors) {
      logError('GraphQL - Error', {
        errors: graphQLErrors,
        operationName: operation.operationName,
        variables: operation.variables,
      });
      content = graphQLErrors.map((error) => `${error.message}\n`);
    }

    if (networkError) {
      const { result } = networkError;
      if (result && result.error && result.error.message) {
        content = result.error.message;
      } else {
        content = 'Network Error!';
      }
    }

    Modal.warning({
      title: 'Error',
      content,
    });
  });

// http link
const createHttpLink = () =>
  new HttpLink({
    uri: '/graphql',
    credentials: 'include',
  });

export const createClient = (cache) => {
  return new ApolloClient({
    link: ApolloLink.from([createErrorLink(), createLinkWithToken(), createHttpLink()]),
    cache,
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  });
};

export const client = createClient(createCache());
export const request = (options) => {
  const { type, ...args } = options;
  return client[type]({ ...args }).catch((errors) => ({ errors }));
};
