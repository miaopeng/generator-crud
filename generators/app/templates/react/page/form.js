import React from 'react';
import { Form, Input, Button } from 'antd';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const <%= gql.Type %>Form = (props) => {
  const { loading } = props;
  return (
    <Form {...layout} name="basic" initialValues={props.initialValues} onFinish={props.onFinish}>
    <% for (const field of gql.list.fields) { %>
      <Form.Item
        label="<%= field.title%>"
        name="<%= field.name%>"
        rules={[{ required: true, message: 'Please input <%= gql.type%> <%= field.title%>!' }]}
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
