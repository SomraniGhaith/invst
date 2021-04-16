const jeton = (state = { name: "", adress: "" }, action: any) => {
  switch (action.type) {
    case "SET_JETON":
      return { name: action.jeton.name, adress: action.jeton.adress };
    default:
      return state;
  }
};
export default jeton;
