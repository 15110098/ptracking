
import en from "../languages/en-US";
import vi from "../languages/vi-VN";

const initialState = {
    language: "en-US",
    strings: en
}


export default function languageReducer(
    state = initialState,
    action
  ) {
    switch (action.language) {
      case "vi-VN":
        return Object.assign({},{
          language: "vi-VN",
          strings: vi
        });
      case "en-US":
        return Object.assign({},{
          language: "en-US",
          strings: en
        });
      default:
        return { ...state };
    }
  }