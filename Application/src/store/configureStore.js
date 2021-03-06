import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import foodTrucksReducer from '../reducers/foodTrucks';
import eventsReducer from '../reducers/events';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//Creating store
export default () => {
  const store = createStore(combineReducers({
    auth: authReducer,
    foodTrucks: foodTrucksReducer,
    events: eventsReducer
  }),
  composeEnhancers(applyMiddleware(thunk))
  //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()//for Chrome devtools
  );
  return store;
};
