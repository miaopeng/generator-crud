import React, { useEffect, useState } from 'react';
import { Card, Descriptions } from 'antd';
import { useRouteMatch } from 'umi';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { readQuery } from './service';

const <%= gql.Type %>Detail = () => {
  const {
    params: { <%= gql.type%>Id },
  } = useRouteMatch();

  const [<%= gql.type%>, set<%= gql.Type%>] = useState({});
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const { errors, data } = await readQuery(<%= gql.type%>Id);
    setLoading(false);
    if (!errors) {
      set<%= gql.Type%>(data.<%= gql.type%>);
    }
  };

  useEffect(() => {
    fetch();
  }, [<%= gql.type%>Id]);

  return (
    <PageHeaderWrapper title={<%= gql.type%>.name || false}>
      <Card loading={loading}>
        <Descriptions title={<%= gql.type%>.name || '<%= gql.Type %>'} bordered>
          <% for (const field of gql.read.fields) { %>
            <Descriptions.Item label="<%= field.title %>">{<%= gql.type%>.<%= field.name %>}</Descriptions.Item>
          <% } %>
        </Descriptions>
      </Card>
    </PageHeaderWrapper>
  );
};
export default <%= gql.Type%>Detail;
