import { request } from '@/utils/apollo';
import {
  <%= gql.list && gql.list.operation + ',' %>
  <%= gql.read && gql.read.operation + ',' %>
  <%= gql.create && gql.create.operation + ',' %>
  <%= gql.update && gql.update.operation + ',' %>
  <%= gql.delete && gql.delete.operation + ',' %>
} from './<%= sourceFile %>';

<% if (gql.list) { %>
export async function listQuery() {
  return request({ type: 'query', query: <%= gql.list.operation %> });
}
<% } %>

<% if (gql.read) { %>
export async function readQuery(id) {
  return request({ type:'query', query: <%= gql.read.operation %>, variables: { id } });
}
<% } %>

<% if (gql.create) { %>
export async function createMutation(input) {
  return request({ type: 'mutate', mutation: <%= gql.create.operation %>, variables: { input } });
}
<% } %>

<% if (gql.update) { %>
export async function updateMutation(input) {
  return request({ type: 'mutate', mutation: <%= gql.update.operation %>, variables: { input } });
}
<% } %>

<% if (gql.delete) { %>
export async function deleteMutation(input) {
  return request({ type: 'mutate', mutation: <%= gql.delete.operation %>, variables: { input } });
}
<% } %>
