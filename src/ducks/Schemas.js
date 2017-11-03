import { Schema, arrayOf, normalize } from 'normalizr';

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where ecocases and comments are placed in, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.

// Read more about Normalizr: https://github.com/gaearon/normalizr

const ecocaseSchema = new Schema('ecocases');
const commentSchema = new Schema('comments');
const accountSchema = new Schema('accounts');

function generateMyAccountSlug(entity) { return entity.account.id; }
const myAccountSchema = new Schema('myAccount', { idAttribute: generateMyAccountSlug });

myAccountSchema.define({
  account: accountSchema,
});

// This is not used because that almost author information is used with ecocase
//ecocaseSchema.define({
//  author: accountSchema
//});

//commentSchema.define({
//  author: accountSchema
//});

const Schemas = {
  ECOCASE: ecocaseSchema,
  ECOCASE_ARRAY: arrayOf(ecocaseSchema),
  COMMENT: commentSchema,
  COMMENT_ARRAY: arrayOf(commentSchema),
  ACCOUNT: accountSchema,
  MY_ACCOUNT: myAccountSchema,
};

export default Schemas;
