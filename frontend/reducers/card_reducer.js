import { RECEIVE_BOARD } from '../actions/board_actions';
import { RECEIVE_CARD, UPDATE_CARD, EDIT_CARD, CREATE_DROPZONE }
from '../actions/card_actions';
import { LOGOUT } from '../actions/session_actions';

import { merge } from 'lodash';

const cardReducer = (state = {}, action) => {
  Object.freeze(state);

  let output;
  let newCard;
  let newState;
  switch (action.type){
    case RECEIVE_BOARD:
    if (action.response.cards === undefined) {
      output = {};
    } else {
      output = action.response.cards;
    }
      return output;
    case RECEIVE_CARD:
      newCard = action.response.card;
      newState = merge({}, state, {[newCard.id]: newCard});
      return newState;
    case UPDATE_CARD:

      newCard = action.response.cardLoad;
      if (newCard.id){
        newState = merge({}, state, {[newCard.id]: { id: parseInt(newCard.id),
                         list_id: parseInt(newCard.list_id),
                         ord: parseInt(newCard.ord),
                         body: newCard.body
                        }});
        return newState;
      } else {
        return state;
      }

    case EDIT_CARD:
      if (action.response){
        newCard = action.response;
        newState = merge({}, state, {[newCard.id]: newCard});
        return newState;
      } else {
        return state;
      }
    case LOGOUT:
        return {};
    case "IGNORE":
      return state;
    default:
      return state;
  }
};

export default cardReducer;
