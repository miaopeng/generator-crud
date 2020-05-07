import React, { useEffect, useState } from 'react';
import { Button, Breadcrumb, Table, Modal, message } from 'antd';
import { Link } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { listQuery, createMutation, updateMutation } from './service';
import <%= gql.Type %>Form from './form';

const <%= gql.Type %>List = () => {
  const [loading, setLoading] = useState(true);
  const [<%= gql.types %>, set<%= gql.Types%>] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [record, setRecord] = useState({});

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

  const list = async () => {
    setLoading(true);
    const { data, errors } = await listQuery();
    setLoading(false);

    if (!errors && data) {
      set<%= gql.Types %>(data.<%= gql.types %>);
    }
  };

  const columns = [
    {
      title: 'ID',
      width: 60,
      dataIndex: 'id',
      render: id => <Link to={`/<%= gql.types%>/${id}`}>{id}</Link>
    },
    <% for (const field of gql.list.fields) { %>
      {
        title: '<%= field.title %>',
        dataIndex: '<%= field.name %>',
        width: 150,
      },
    <% } %>
    {
      title: 'Actions',
      align: 'right',
      render: (text, data) => {
        return (
          <Button
            onClick={() => {
              setRecord(data);
              setEditModalVisible(true);
            }}
          >
            <EditOutlined />
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    list();
  }, []);

  const onFinish = async (values) => {
    await add(values);
    list();
  };

  const onEditFinish = async (values) => {
    await update({ ...values, id: record.id });
    list();
  };

  const routes = [
    {
      path: '/<%= gql.types %>',
      breadcrumbName: '<%= gql.type %>',
    },
    {
      breadcrumbName: 'list',
    },
  ];

  return (
    <>
      <div className="flex space-between mb1">
        <Breadcrumb routes={routes} />
        <Button onClick={() => setModalVisible(true)}>Add</Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={<%= gql.types %>}
        size="small"
        pagination={false}
        loading={loading}
      />
      <Modal
        width={720}
        destroyOnClose
        title="Add <%= gql.Type %>"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <<%= gql.Type %>Form onFinish={onFinish} loading={loading} />
      </Modal>
      <Modal
        width={720}
        destroyOnClose
        title="Edit <%= gql.Type %>"
        visible={editModalVisible}
        onCancel={() => {
          setRecord({});
          setEditModalVisible(false);
        }}
        footer={null}
      >
        <<%= gql.Type %>Form onFinish={onEditFinish} loading={loading} initialValues={record} />
      </Modal>
    </>
  );
};
export default <%= gql.Type %>List;
