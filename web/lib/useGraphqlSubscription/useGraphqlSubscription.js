import {useConfig} from '@niftgen/useConfig';
import {useEffect} from 'react';

export function useGraphqlSubscription(query, params, next, error, enabled) {
  const config = useConfig();
  useEffect(() => {
    if (!enabled) {
      return;
    }

    async function run() {
      const [{Amplify}, {API}, {graphqlOperation}] = await Promise.all([
        import(/* webpackChunkName: "aws" */ '@aws-amplify/core/lib-esm/Amplify'),
        import(/* webpackChunkName: "aws" */ '@aws-amplify/api/lib-esm/API'),
        import(/* webpackChunkName: "aws" */ '@aws-amplify/api-graphql/lib-esm/GraphQLAPI'),
      ]);

      Amplify.configure({
        aws_appsync_region: config.region,
        aws_appsync_graphqlEndpoint: `${config.api}/graphql`,
        aws_appsync_authenticationType: 'API_KEY',
        aws_appsync_apiKey: config.apikey,
        graphql_endpoint_iam_region: config.region,
      });

      return API.graphql(graphqlOperation(query, params)).subscribe({next, error});
    }

    const subscriptionPromise = run();

    return () => {
      if (subscriptionPromise) {
        subscriptionPromise.then(subscription => subscription.unsubscribe());
      }
    };
  }, [config.api, config.apikey, config.region, error, next, params, query, enabled]);
}
