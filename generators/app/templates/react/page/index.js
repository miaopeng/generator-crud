import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  Table,
  <%= gql.create &&  'Button,' %>
  <%= (gql.create || gql.update) && 'Modal, message,' %>
  <%= gql.delete && 'Popconfirm,' %>
} from 'antd';
<% if (gql.update || gql.delete) { %>import {
  <%= gql.update &&  'Edit,' %>
  <%= gql.read &&  'ChevronRight,' %>
  <%= gql.delete &&  'Trash,' %>
} from 'react-feather'; <% } %>
<% if (gql.read) { %>import { Link } from 'umi';<% } %>
import {
  listQuery<%= gql.create && ', createMutation' %>
  <%= gql.update && ', updateMutation' %>
  <%= gql.delete && ', deleteMutation' %>
} from './service';
<% if (gql.create || gql.update) { %> import <%= gql.Type %>Form from './form'; <% } %>

const <%= gql.Type %>List = () => {
  const [loading, setLoading] = useState(true);
  const [<%= gql.types %>, set<%= gql.Types %>] = useState([]);
  <% if (gql.create) { %>const [modalVisible, setModalVisible] = useState(false); <% } %>
  <% if (gql.update) { -%>
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [record, setRecord] = useState({});
  <% } -%>

  const list = async () => {
    setLoading(true);
    const { data, errors } = await listQuery();
    setLoading(false);

    if (!errors && data) {
      set<%= gql.Types %>(data.<%= gql.types %>);
    }
  };

  <% if (gql.update) { %>
  const update = async (values) => {
    setLoading(true);
    const { errors } = await updateMutation(values);

    if (!errors) {
      message.success('update <%= gql.Type %> successfully');
      setEditModalVisible(false);
      setLoading(false);
      return Promise.resolve();
    }
    message.error('update <%= gql.Type %> failed!');
    setLoading(false);
    return Promise.reject();
  };

  const openEdit = (data) => {
    setRecord(data);
    setEditModalVisible(true);
  }

  const onEditFinish = async (values) => {
    await update({ ...values, id: record.id });
    list();
  };
  <% } %>

  <% if (gql.delete) { %>
  const deleteAction = async (id) => {
    setLoading(true);
    const { errors } = await deleteMutation(id);
    setLoading(false);

    if (!errors) {
      message.success('Delete Enterprise successfully');
      return Promise.resolve();
    }
    message.error('Delete Enterprise failed!');
    return Promise.reject();
  };

  const onDelete = async (id) => {
    await deleteAction(id);
    list();
  };
<% } %>

const columns = [
  <% for (const field of gql.list.fields) { %>
  {
    title: '<%= field.title %>',
    dataIndex: '<%= field.name %>',
    width: 150,
  },
  <% } %>
  <% if (gql.read) { %>
  {
    title: '',
    render: (text, { id }) => <Link to={`/<%= gql.types%>/${id}`}>详情<ChevronRight className="iconmate"/></Link>,
  },
  <% } %>
  <% if (gql.update || gql.delete) { %>
  {
    title: 'Actions',
    align: 'right',
    render: (text, data) => {
      return (
        <>
          <a className="mr1" title="编辑" onClick={() => openEdit(data)}>
            <Edit className="iconmate"/> 编辑
          </a>
          <Popconfirm title="您确认要删除此项吗？" onConfirm={() => onDelete(data.id)}>
            <a className="mr1" title="删除">
              <Trash className="iconmate" /> 删除
            </a>
          </Popconfirm>
        </>
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
  const { errors } = await createMutation(values);

  if (!errors) {
    message.success('Add <%= gql.Type %> successfully');
    setModalVisible(false);
    setLoading(false);
    return Promise.resolve();
  }
  message.error('Add <%= gql.Type %> failed!');
  setLoading(false);
  return Promise.reject();
};

const onFinish = async (values) => {
  await add(values);
  list();
};
<% } %>


const routes = [{path: '/<%= gql.types %>', breadcrumbName: '<%= gql.Type %>' } ];

return (
<>
  <div className="flex space-between mb1">
    <Breadcrumb routes={routes} />
    <% if (gql.create) { %> <Button onClick={() => setModalVisible(true)}>Add</Button><% } %>
  </div>
  <Table rowKey="id"
    columns={columns}
    dataSource={<%= gql.types %>}
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
