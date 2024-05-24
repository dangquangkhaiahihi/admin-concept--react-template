import { createStore, applyMiddleware } from 'redux';
import ReducerCombined from './reducer-combine';
import thunk from 'redux-thunk';

export default createStore(ReducerCombined, {}, applyMiddleware(thunk))