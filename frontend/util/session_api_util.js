export const signup = ({username, password}) => {
  return $.ajax({
    method: 'POST',
    url: '/api/users',
    data: { user: { username, password }}
  });
};

export const login = ({username, password}) => {
  return $.ajax({
    method: 'POST',
    url: '/api/session',
    data: { user: { username, password }}
  });
};

export const boardIndex = ( boards ) => {
  return $.ajax({
    method: 'GET',
    url: '/api/boards',
    data: { boards }
  });
};

export const boardShow = (id) => {
  return $.ajax({
    method: 'GET',
    url: `/api/boards/${id}`,
  });
};

export const createBoard = (board) => {
  return $.ajax({
    method: "POST",
    url: '/api/boards',
    data: { board }
  });
};

export const createCard = (card) => {
  return $.ajax({
    method: "POST",
    url: '/api/cards',
    data: { card },
  });
};

export const moveCard = (cardLoad) => {
  debugger
  return $.ajax({
    method: "POST",
    url: `/api/moves/`,
    data: { cardLoad },
  });
};

export const createList = (list) => {
  return $.ajax({
    method: "POST",
    url: '/api/lists',
    data: { list: list }  //list sets the key: "list"
  });
};


export const logout = () => {
  return $.ajax({
    method: 'DELETE',
    url: '/api/session'
  });
};
