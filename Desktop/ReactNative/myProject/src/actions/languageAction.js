import {CHANGE_LANGUAGE} from './types'


export const changeLanguage = (language) => dispatch => {
    dispatch({
        type: CHANGE_LANGUAGE,
        language: language
      });
}