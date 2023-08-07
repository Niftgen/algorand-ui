import {createStore} from '@niftgen/useStore';
import formatISO from 'date-fns/formatISO';

export const UPDATE = 'account update';
export const REMOVE = 'account remove';

export const initialState = {
  id: -1,
  walletAddress: '',
  avatarPath: null,
  dateOfBirth: null,
  email: null,
  userName: null,
  interests: [],
  types: [],
  bio: null,
  referralCode: '',
  twitterUrl: null,
  instagramUrl: null,
  discordUrl: null,
  facebookUrl: null,
  videoCreator: false,
  phone: null,
  phoneValidated: false,
  metadata: {
    ref: {
      code: '',
      createdAt: null,
    },
    callsEnabled: false,
    cal: '',
  },

  messageReceivedTotals: {
    nftMessageRead: 0,
    nftMessageTotal: 0,
    privateMessageRead: 0,
    privateMessageTotal: 0,
  },
};

export function normaliseMetadata({metadata}) {
  let meta = {};
  if (typeof metadata === 'string') {
    try {
      meta = JSON.parse(metadata);
    } catch (_e) {
      meta = initialState.metadata;
      // nothing
    }
  } else if (metadata) {
    if (metadata?.ref) {
      meta.ref = metadata.ref;
    }
    meta.callsEnabled = Boolean(metadata.callsEnabled);
    meta.cal = metadata.cal;
  }
  const ref = {
    ...initialState.metadata.ref,
    ...meta?.ref,
  };
  return {
    ref,
    callsEnabled: meta.callsEnabled,
    cal: meta.cal,
  };
}

export function normaliseDateOfBirth({dateOfBirth}) {
  const dob = dateOfBirth ? new Date(dateOfBirth) : null;
  return dob ? formatISO(dob, {representation: 'date'}) : null;
}

export function normaliseAccount(user) {
  if (!user) {
    return null;
  }
  return Object.fromEntries(
    Object.entries(user)
      .filter(([key]) => key in initialState)
      .map(([key, val]) => {
        switch (key) {
          case 'dateOfBirth':
            return [key, normaliseDateOfBirth(user)];
          case 'metadata':
            return [key, normaliseMetadata(user)];
          default:
            return [key, val];
        }
      })
  );
}

export function onUpdate(state, user) {
  if (!user) {
    return state;
  }
  return {
    ...state,
    ...normaliseAccount(user),
  };
}

function onRemove(state) {
  return state.id <= 0 ? state : {...initialState};
}

const {useStore, StoreProvider} = createStore({
  actions: {
    [UPDATE]: onUpdate,
    [REMOVE]: onRemove,
  },
  initialState,
  name: 'Account',
});

export const useAccountStore = useStore;
export const AccountProvider = StoreProvider;
