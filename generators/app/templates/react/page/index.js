import React, { useEffect, useState } from 'react';
import { Breadcrumb, Table, <% if (gql.create || gql.update) { %>Button, Modal, message<% } %> } from 'antd';
<% if (gql.update) { %>import { Edit } from 'react-feather'; <% } %>
import { listQuery<%= gql.create && ', createMutation'%><%= gql.update && ', updateMutation' %> } from './service';
<% if (gql.create || gql.update) { %> import <%= gql.Type %>Form from './form'; <% } %>

const <%= gql.Type %>List = () => {
  const [loading, setLoading] = useState(true);
  const [<%= gql.types %>, set<%= gql.Types %>] = useState([]);
  <% if (gql.create) { %>const [modalVisible, setModalVisible] = useState(false); <% } %>
  <% if (gql.update) { %>
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [record, setRecord] = useState({});
  <% } %>

  const list = async () => {
    setLoading(true);
    const { data, errors } = await listQuery();
    setLoading(false);

    if (!errors && data) {
      set<%= gql.Types %>(data.<%= gql.types %>);
    }
  };

  const columns = [
  <% for (const field of gql.list.fields) { %>
  {
    title: '<%= field.title %>',
    dataIndex: '<%= field.name %>',
    width: 150,
  },
  <% } %>
  <% if (gql.update) { %>
  {
    title: 'Actions',
    align: 'right',
    render: (text, data) => {
      return (
        <Button type="link" onClick={()=> {
          setRecord(data);
          setEditModalVisible(true);
          }}
          >
          <Edit />
        </Button>
      );
    },
  },
  <% } %>
  ];

useEffect(() => {
  list();
}, []);

<% if (gql.create) { %>
const add = async (values) => {
  setLoading(true);
  const { data, errors } = await createMutation(values);
  setLoading(false);

  if (!errors && data) {
    message.success('Add <%= gql.Type %> successfully');
    setModalVisible(false);
    return Promise.resolve();
  }
  message.error('Add <%= gql.Type %> failed!');
  return Promise.reject();
};

const onFinish = async (values) => {
  await add(values);
  list();
};
<% } %>

<% if (gql.update) { %>
const update = async (values) => {
  setLoading(true);
  const { data, errors } = await updateMutation(values);
  setLoading(false);

  if (!errors && data) {
    message.success('update <%= gql.Type %> successfully');
    setEditModalVisible(false);
    return Promise.resolve();
  }
  message.error('update <%= gql.Type %> failed!');
  return Promise.reject();
};
const onEditFinish = async (values) => {
  await update({ ...values, id: record.id });
  list();
};
<% } %>

const routes = [{
  breadcrumbName: '<%= gql.Type %>',
},{
  breadcrumbName: 'list',
}];

return (
<>
  <div className="flex space-between mb1">
    <Breadcrumb routes={routes} />
    <% if (gql.create) { %> <Button onClick={() => setModalVisible(true)}>Add</Button><% } %>
  </div>
  <Table rowKey="id"
    columns={columns}
    dataSource={<%= gql.types %>}
    size="small"
    pagination={false}
    loading={loading} />
  <% if (gql.create) { %>
  <Modal width={720}
    destroyOnClose
    title="Add <%= gql.Type %>"
    visible={modalVisible}
    onCancel={()=> setModalVisible(false)}
    footer={null}
    >
    <<%= gql.Type %>Form onFinish={onFinish} loading={loading} />
  </Modal>
  <% } %>
  <% if (gql.update) { %>
  <Modal width={720}
    destroyOnClose
    title="Edit <%= gql.Type %>"
    visible={editModalVisible}
    onCancel={()=> {
      setRecord({});
      setEditModalVisible(false);
    }}
    footer={null}
  >
    <<%= gql.Type %>Form onFinish={onEditFinish} loading={loading} initialValues={record} />
  </Modal>
  <% } %>
</>
);
};
export default <%= gql.Type %>List;
