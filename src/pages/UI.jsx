import React from 'react'

import {Layout} from 'antd'
const {Header, Sider, Content, Footer} = Layout

export default () => {
  return (
    <div>
      <Layout>
        <Header>header</Header>
        <Layout>
          <Sider>left sidebar</Sider>
          <Content>main content</Content>
          <Sider>right sidebar</Sider>
        </Layout>
        <Footer>footer</Footer>
      </Layout>
    </div>
  )
}