import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import groupsReducer from './slices/groups';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};



const groupsPersistConfig = {
  key: 'groups',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['groups', 'group', 'trackerTab'],
};

const rootReducer = combineReducers({
  // mail: mailReducer,
  groups: persistReducer(groupsPersistConfig, groupsReducer),
});

export { rootPersistConfig, rootReducer };
