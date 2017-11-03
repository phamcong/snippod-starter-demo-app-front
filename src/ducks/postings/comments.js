const debug = require('utils/getDebugger')('comments');
import { updateEntity } from 'ducks/globalActions';
import { showDelayedToastMessage } from 'ducks/messages/toastMessage';
import toastMessages from 'i18nDefault/toastMessages';
import Schemas from 'ducks/Schemas';
import { COMMENTS_BY_ECOCASE, COMMENTS_BY_ACCOUNT } from 'ducks/postings';


/********************************
          get comment
 ********************************/
const COMMENT_REQUEST = 'ecocases/comments/COMMENT_REQUEST';
const COMMENT_SUCCESS = 'ecocases/comments/COMMENT_SUCCESS';
const COMMENT_FAILURE = 'ecocases/comments/COMMENT_FAILURE';

export const COMMENT_ARRAY = [
  COMMENT_REQUEST,
  COMMENT_SUCCESS,
  COMMENT_FAILURE
];

// Fetches a single repository from REST API.
// Relies on the custom API middleware defined in ../middleware/clientMiddleware and helpers/ApiClient.js.
export function fetchComment(commentId) {
  return {
    types: COMMENT_ARRAY,
    promise: (client) => client.get('/comments/' + commentId + '/', {
      schema: Schemas.COMMENT
    })
  };
}

// Fetches a single comment from REST API unless it is cached.
// Relies on Redux Thunk middleware.
export function loadComment(commentId, requiredFields = []) {
  return (dispatch, getState) => {
    const comment = getState().entities.comments[commentId];
    if (comment && requiredFields.every(key => comment.hasOwnProperty(key))) {
      return null;
    }

    return dispatch(fetchComment(commentId));
  };
}


/********************************
        submit comment
 ********************************/
const SUBMIT_COMMENT_REQUEST = 'ecocases/comments/SUBMIT_COMMENT_REQUEST';
const SUBMIT_COMMENT_SUCCESS = 'ecocases/comments/SUBMIT_COMMENT_SUCCESS';
const SUBMIT_COMMENT_FAILURE = 'ecocases/comments/SUBMIT_COMMENT_FAILURE';

export const SUBMIT_COMMENT_ARRAY = [
  SUBMIT_COMMENT_REQUEST,
  SUBMIT_COMMENT_SUCCESS,
  SUBMIT_COMMENT_FAILURE
];


export function submitComment(submitCommentForm) {
  return {
    types: SUBMIT_COMMENT_ARRAY,
    promise: (client) => client.post('/comments/', {
      data: {
        ecocase: submitCommentForm.ecocaseId,
        content: submitCommentForm.content
      },
      schema: Schemas.COMMENT
    })
  };
}

/********************************
          delete Comment
 ********************************/
const DELETE_COMMENT_REQUEST = 'ecocases/comments/DELETE_COMMENT_REQUEST';
const DELETE_COMMENT_SUCCESS = 'ecocases/comments/DELETE_COMMENT_SUCCESS';
const DELETE_COMMENT_FAILURE = 'ecocases/comments/DELETE_COMMENT_FAILURE';

export const DELETE_COMMENT_ARRAY = [
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_FAILURE
];

function fetchDeleteComment(commentId) {
  return {
    types: DELETE_COMMENT_ARRAY,
    promise: (client) => client.del('/comments/' + commentId + '/')
  };
}

// Relies on Redux Thunk middleware.
export function deleteComment(commentId) {
  return (dispatch, getState) => {
    dispatch(fetchDeleteComment(commentId))
      .then(() => {
        const deletedComment = getState().entities.comments[commentId];
        deletedComment.deleted = true;
        dispatch(updateEntity('comments', commentId, deletedComment));
        dispatch(showDelayedToastMessage({
          type: 'info',
          title: toastMessages.deleteCommentTitle,
          body: toastMessages.deleteCommentBody
        }, 30));
      })
    ;
  };
}

/********************************
          upvote comment
 ********************************/
const UPVOTE_COMMENT_REQUEST = 'ecocases/ecocases/UPVOTE_COMMENT_REQUEST';
const UPVOTE_COMMENT_SUCCESS = 'ecocases/ecocases/UPVOTE_COMMENT_SUCCESS';
const UPVOTE_COMMENT_FAILURE = 'ecocases/ecocases/UPVOTE_COMMENT_FAILURE';

export const UPVOTE_COMMENT_ARRAY = [
  UPVOTE_COMMENT_REQUEST,
  UPVOTE_COMMENT_SUCCESS,
  UPVOTE_COMMENT_FAILURE
];

export function upvoteComment(commentId) {
  return {
    types: UPVOTE_COMMENT_ARRAY,
    promise: (client) => client.post('/comments/' + commentId + '/upvote/', {
      schema: Schemas.COMMENT
    })
  };
}

/********************************
        cancel upvote ecocase
 ********************************/
const CANCEL_UPVOTE_COMMENT_REQUEST = 'ecocases/ecocases/CANCEL_UPVOTE_COMMENT_REQUEST';
const CANCEL_UPVOTE_COMMENT_SUCCESS = 'ecocases/ecocases/CANCEL_UPVOTE_COMMENT_SUCCESS';
const CANCEL_UPVOTE_COMMENT_FAILURE = 'ecocases/ecocases/CANCEL_UPVOTE_COMMENT_FAILURE';

export const CANCEL_UPVOTE_COMMENT_ARRAY = [
  CANCEL_UPVOTE_COMMENT_REQUEST,
  CANCEL_UPVOTE_COMMENT_SUCCESS,
  CANCEL_UPVOTE_COMMENT_FAILURE
];

export function cancelUpvoteComment(commentId) {
  return {
    types: CANCEL_UPVOTE_COMMENT_ARRAY,
    promise: (client) => client.post('/comments/' + commentId + '/cancel_upvote/', {
      schema: Schemas.COMMENT
    })
  };
}

/********************************
  get commentsByEcocase pagination
 ********************************/
const COMMENTS_BY_ECOCASE_REQUEST = 'ecocases/comments/COMMENTS_BY_ECOCASE_REQUEST';
const COMMENTS_BY_ECOCASE_SUCCESS = 'ecocases/comments/COMMENTS_BY_ECOCASE_SUCCESS';
const COMMENTS_BY_ECOCASE_FAILURE = 'ecocases/comments/COMMENTS_BY_ECOCASE_FAILURE';

export const COMMENTS_BY_ECOCASE_ARRAY = [
  COMMENTS_BY_ECOCASE_REQUEST,
  COMMENTS_BY_ECOCASE_SUCCESS,
  COMMENTS_BY_ECOCASE_FAILURE
];

const ADD_COMMENT_TO_TOP_AT_COMMENTS_BY_ECOCASE = 'ecocases/comments/ADD_COMMENT_TO_TOP_AT_COMMENTS_BY_ECOCASE';
const ADD_COMMENT_TO_BOTTOM_AT_COMMENTS_BY_ECOCASE = 'ecocases/comments/ADD_COMMENT_TO_BOTTOM_AT_COMMENTS_BY_ECOCASE';
const DELETE_COMMENT_AT_COMMENTS_BY_ECOCASE = 'ecocases/comments/DELETE_COMMENT_AT_COMMENTS_BY_ECOCASE';
const DELETE_ALL_AT_COMMENTS_BY_ECOCASE = 'ecocases/comments/DELETE_ALL_AT_COMMENTS_BY_ECOCASE';

export const IO_COMMENT_AT_COMMENTS_BY_ECOCASE_ARRAY = [
  ADD_COMMENT_TO_TOP_AT_COMMENTS_BY_ECOCASE,
  ADD_COMMENT_TO_BOTTOM_AT_COMMENTS_BY_ECOCASE,
  DELETE_COMMENT_AT_COMMENTS_BY_ECOCASE,
  DELETE_ALL_AT_COMMENTS_BY_ECOCASE
];

function fetchCommentsByEcocase(ecocaseId, nextPageUrl) {
  return {
    key: ecocaseId,
    types: COMMENTS_BY_ECOCASE_ARRAY,
    promise: (client) => client.get(nextPageUrl, {
      schema: Schemas.COMMENT_ARRAY
    })
  };
}

// Relies on Redux Thunk middleware.
export function loadCommentsByEcocase(ecocaseId, nextPage) {
  return (dispatch, getState) => {
    const {
      nextPageUrl = '/ecocase/' + ecocaseId + '/comments/',
      pageCount = 0
      } = getState().postings.commentsByEcocase[ecocaseId] || {};

    if (pageCount > 0 && !nextPage) {
      return null;
    }

    return dispatch(fetchCommentsByEcocase(ecocaseId, nextPageUrl));
  };
}

export function addCommentToTopAtCommentsByEcocase(ecocaseId, id) {
  return {
    key: ecocaseId,
    type: ADD_COMMENT_TO_TOP_AT_COMMENTS_BY_ECOCASE,
    id
  };
}

export function addCommentToBottomAtCommentsByEcocase(ecocaseId, id) {
  return {
    key: ecocaseId,
    type: ADD_COMMENT_TO_BOTTOM_AT_COMMENTS_BY_ECOCASE,
    id
  };
}

export function deleteCommentAtCommentsByEcocase(ecocaseId, id) {
  return {
    key: ecocaseId,
    type: DELETE_COMMENT_AT_COMMENTS_BY_ECOCASE,
    id
  };
}

export function deleteAllAtCommentsByEcocase(ecocaseId = null) {
  return {
    key: ecocaseId,
    type: DELETE_ALL_AT_COMMENTS_BY_ECOCASE,
  };
}

/********************************
 get commentsByAccount pagination
 ********************************/
const COMMENTS_BY_ACCOUNT_REQUEST = 'ecocases/comments/COMMENTS_BY_ACCOUNT_REQUEST';
const COMMENTS_BY_ACCOUNT_SUCCESS = 'ecocases/comments/COMMENTS_BY_ACCOUNT_SUCCESS';
const COMMENTS_BY_ACCOUNT_FAILURE = 'ecocases/comments/COMMENTS_BY_ACCOUNT_FAILURE';

export const COMMENTS_BY_ACCOUNT_ARRAY = [
  COMMENTS_BY_ACCOUNT_REQUEST,
  COMMENTS_BY_ACCOUNT_SUCCESS,
  COMMENTS_BY_ACCOUNT_FAILURE
];

const ADD_COMMENT_TO_TOP_AT_COMMENTS_BY_ACCOUNT = 'ecocases/comments/ADD_COMMENT_TO_TOP_AT_COMMENTS_BY_ACCOUNT';
const ADD_COMMENT_TO_BOTTOM_AT_COMMENTS_BY_ACCOUNT = 'ecocases/comments/ADD_COMMENT_TO_BOTTOM_AT_COMMENTS_BY_ACCOUNT';
const DELETE_COMMENT_AT_COMMENTS_BY_ACCOUNT = 'ecocases/comments/DELETE_COMMENT_AT_COMMENTS_BY_ACCOUNT';
const DELETE_ALL_AT_COMMENTS_BY_ACCOUNT = 'ecocases/comments/DELETE_ALL_AT_COMMENTS_BY_ACCOUNT';

export const IO_COMMENT_AT_COMMENTS_BY_ACCOUNT_ARRAY = [
  ADD_COMMENT_TO_TOP_AT_COMMENTS_BY_ACCOUNT,
  ADD_COMMENT_TO_BOTTOM_AT_COMMENTS_BY_ACCOUNT,
  DELETE_COMMENT_AT_COMMENTS_BY_ACCOUNT,
  DELETE_ALL_AT_COMMENTS_BY_ACCOUNT
];

function fetchCommentsByAccount(accountId, nextPageUrl) {
  return {
    key: accountId,
    types: COMMENTS_BY_ACCOUNT_ARRAY,
    promise: (client) => client.get(nextPageUrl, {
      schema: Schemas.COMMENT_ARRAY
    })
  };
}

// Relies on Redux Thunk middleware.
export function loadCommentsByAccount(accountId, nextPage) {
  return (dispatch, getState) => {
    const {
      nextPageUrl = '/user/' + accountId + '/comments/',
      pageCount = 0
      } = getState().postings.commentsByAccount[accountId] || {};

    if (pageCount > 0 && !nextPage) {
      return null;
    }

    return dispatch(fetchCommentsByAccount(accountId, nextPageUrl));
  };
}

export function addCommentToTopAtCommentsByAccount(accountId, id) {
  return {
    key: accountId,
    type: ADD_COMMENT_TO_TOP_AT_COMMENTS_BY_ACCOUNT,
    id
  };
}

export function addCommentToBottomAtCommentsByAccount(accountId, id) {
  return {
    key: accountId,
    type: ADD_COMMENT_TO_BOTTOM_AT_COMMENTS_BY_ACCOUNT,
    id
  };
}

export function deleteCommentAtCommentsByAccount(accountId, id) {
  return {
    key: accountId,
    type: DELETE_COMMENT_AT_COMMENTS_BY_ACCOUNT,
    id
  };
}

export function deleteAllAtCommentsByAccount(accountId = null) {
  return {
    key: accountId,
    type: DELETE_ALL_AT_COMMENTS_BY_ACCOUNT,
  };
}

/********************************
    for comments and composer
 ********************************/
// Relies on Redux Thunk middleware.
export function loadComments(type, option, nextPage) {
  return (dispatch, getState) => {
    switch (type) {
      case COMMENTS_BY_ECOCASE :
        return dispatch(loadCommentsByEcocase(option, nextPage));
      case COMMENTS_BY_ACCOUNT :
        return dispatch(loadCommentsByAccount(option, nextPage));
      default:
        throw new Error('Expected comments pagination types.');
    }
  };
}

export function insertCommentToCommentsPagination(id) {
  return (dispatch, getState) => {
    const comment = getState().entities.comments[id];
    dispatch(addCommentToTopAtCommentsByEcocase(comment.ecocase, id));
    dispatch(addCommentToTopAtCommentsByAccount(comment.author.id, id));
  };
}
