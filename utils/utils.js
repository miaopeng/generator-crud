const fs = require("fs");
const pluralize = require("pluralize");
const { getDescription, parse } = require("graphql");

/**
 * Provided previous "queryFacts", a GraphQL schema, and a query document
 * string, return a set of facts about that query useful for GraphiQL features.
 *
 * If the query cannot be parsed, returns undefined.
 */
function getQueryFacts(schema, documentStr) {
  if (!documentStr) {
    return;
  }

  let documentAST;
  try {
    documentAST = parse(documentStr);
  } catch (_) {
    return;
  }

  // Const variableToType = schema
  //   ? collectVariables(schema, documentAST)
  //   : undefined;
  // Collect operations by their names.
  const operations = {};

  const buildOperation = node => {
    const query = getFirstField(node);
    const describedFields = getFields(query, { described: true });
    const fields = describedFields.length ? describedFields : getFields(query);
    return {
      operation: node.name.value,
      query: query && query.name.value,
      fields: fields.map(f => ({
        name: f.name.value,
        title: getDesc(f) || f.name.value
      }))
    };
  };

  documentAST.definitions.forEach(def => {
    if (def.kind === "OperationDefinition") {
      if (!operations.list && def.name.value.startsWith("list")) {
        operations.list = buildOperation(def);
      }

      if (!operations.read && def.name.value.startsWith("read")) {
        operations.read = buildOperation(def);
      }

      if (!operations.create && def.name.value.startsWith("create")) {
        operations.create = buildOperation(def);
      }

      if (!operations.update && def.name.value.startsWith("update")) {
        operations.update = buildOperation(def);
      }
    }
  });
  return operations;
}

/**
 * Provided a schema and a document, produces a `variableToType` Object.
 */
// function collectVariables(schema, documentAST) {
//   const variableToType = Object.create(null);
//   documentAST.definitions.forEach(definition => {
//     if (definition.kind === "OperationDefinition") {
//       const variableDefinitions = definition.variableDefinitions;
//       if (variableDefinitions) {
//         variableDefinitions.forEach(({ variable, type }) => {
//           const inputType = typeFromAST(schema, type);
//           if (inputType) {
//             variableToType[variable.name.value] = inputType;
//           }
//         });
//       }
//     }
//   });
//   return variableToType;
// }

function getFirstField(node = {}) {
  const { selectionSet } = node;
  if (!selectionSet || !selectionSet.selections) {
    return null;
  }

  return selectionSet.selections.find(f => f.kind === "Field");
}

function getFields(node = {}, opt = {}) {
  const { selectionSet } = node;
  const { described = false } = opt;
  if (!selectionSet || !selectionSet.selections) {
    return [];
  }

  const fields = selectionSet.selections.filter(f => f.kind === "Field");
  if (!described) {
    return fields;
  }

  return fields.filter(f => Boolean(getDesc(f)));
}

function getDesc(node = {}) {
  return getDescription(node, { commentDescriptions: true });
}

const capitalize = str => str[0].toUpperCase() + str.slice(1);

const gql = {
  getTypes(type) {
    const types = pluralize(type);
    const Type = capitalize(type);
    const Types = pluralize(Type);

    return {
      type,
      types,
      Type,
      Types
    };
  },

  getNames(type) {
    const { types, Type, Types } = gql.getTypes(type);

    return {
      type,
      types,
      Type,
      Types,
      ListOperation: `List${Types}`,
      ReadOperation: `Read${Type}`,
      CreateOperation: `Create${Type}`,
      UpdateOperation: `Update${Type}`,
      listQuery: types,
      readQuery: type,
      createMutation: `create${Type}`,
      updateMutation: `update${Type}`,
      CreateInput: `Create${Type}Input`,
      UpdateInput: `Update${Type}Input`,
      Fragment: `${Type}Fragment`
    };
  },
  getOpertionsFromFile(file) {
    const string = fs.readFileSync(file, "utf8");
    return getQueryFacts(null, string);
  }
};

module.exports = {
  gql,
  getDesc,
  getFields,
  getFirstField,
  getQueryFacts
};
