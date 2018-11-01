import { Tabs } from 'antd';
import Todo from './list';

const TabPane = Tabs.TabPane;

class Index extends React.Component {
  render() {
    return (
      <div>
        <Tabs animated={false} defaultActiveKey="1">
          <TabPane tab="全部任务" key="1">
            <Todo type="all" />
          </TabPane>
          <TabPane tab="未完成任务" key="2">
            <Todo type="undone" />
          </TabPane>
          <TabPane tab="已完成任务" key="3">
            <Todo type="done" />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

module.exports = Index;
