import { request } from '@/utils/apollo';
import {
  <% if (gql.list) { %><%= gql.list.operation %>, <% } %>
  <% if (gql.read) { %> <%= gql.read.operation %>, <% } %>
  <% if (gql.create) { %> <%= gql.create.operation %>, <% } %>
  <% if (gql.update) { %> <%= gql.update.operation %>, <% } %>
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
