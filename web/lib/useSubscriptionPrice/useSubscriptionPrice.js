import {useAlgoAccount} from '@niftgen/useAlgod';
import {useAlgoPrice} from '@niftgen/useAlgoPrice';
import {useAuth} from '@niftgen/useAuth';
import {useConfig} from '@niftgen/useConfig';
import algosdk from 'algosdk';

export function useCreatorSubscriptionPrice() {
  const {MONTHLY_CREATOR_SUBSCRIPTION} = useConfig();
  const {walletAddress} = useAuth();
  const userAlgoAccount = useAlgoAccount(walletAddress);

  const {data: algoPrice} = useAlgoPrice();
  const userBalance = userAlgoAccount.data ? userAlgoAccount.data.amount - userAlgoAccount.data['min-balance'] : 0;
  const subscriptionPriceInAlgo = algoPrice?.price
    ? algosdk.algosToMicroalgos(MONTHLY_CREATOR_SUBSCRIPTION / (algoPrice.price * 100))
    : 0;
  const hasEnoughBalance = subscriptionPriceInAlgo < userBalance;

  return {
    userBalance,
    subscriptionPriceInAlgo,
    subscriptionPriceInUsd: MONTHLY_CREATOR_SUBSCRIPTION,
    hasEnoughBalance,
  };
}

export function usePlatformSubscriptionPrice() {
  const {MONTHLY_PLATFORM_SUBSCRIPTION} = useConfig();
  const {walletAddress} = useAuth();
  const userAlgoAccount = useAlgoAccount(walletAddress);

  const {data: algoPrice} = useAlgoPrice();
  const userBalance = userAlgoAccount.data ? userAlgoAccount.data.amount - userAlgoAccount.data['min-balance'] : 0;
  const subscriptionPriceInAlgo = algoPrice?.price
    ? algosdk.algosToMicroalgos(MONTHLY_PLATFORM_SUBSCRIPTION / (algoPrice.price * 100))
    : 0;
  const hasEnoughBalance = subscriptionPriceInAlgo < userBalance;

  return {
    userBalance,
    subscriptionPriceInAlgo,
    subscriptionPriceInUsd: MONTHLY_PLATFORM_SUBSCRIPTION,
    hasEnoughBalance,
  };
}
