import React from 'react';
import { Form, Input, Button } from 'antd';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 12 },
};

const <%= gql.Type %>Form = (props) => {
  const { loading } = props;
  return (
    <Form {...layout} name="basic" initialValues={props.initialValues} onFinish={props.onFinish}>
    <% for (const field of gql.list.fields) { %>
      <Form.Item
        label="<%= field.title%>"
        name="<%= field.name%>"
        rules={[{ required: true, message: '请输入<%= field.title%>!' }]}
      >
        <Input />
      </Form.Item>
    <% } %>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export default <%= gql.Type %>Form;
