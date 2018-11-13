import Demo from 'component/reduxDemo';
import App from 'component/index';
import login from './login';
import NotFound from './404';
import file from './file';
import chat from './chat';
import { newComponent } from './hoc';
import { Steps, Button } from 'antd';
import todo from './todo';

const Step = Steps.Step;

var author = 'andy';
var content = 'hope is a good thing';
// var query = `mutation CreateMessage($input: MessageInput) {
//   createMessage(input: $input) {
//     id
//     author
//     content
//   }
// }`;
var updateQuery = `mutation UpdateMessage($id: ID!, $input: MessageInput) {
  updateMessage(id: $id, input: $input) {
    id
    author
    content
  }
}`;

const Index = () => {
  // const post = () =>
  //   fetch('/api/graphql', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //     },
  //     body: JSON.stringify({
  //       query,
  //       variables: {
  //         input: {
  //           author,
  //           content,
  //         },
  //       },
  //     }),
  //   });

  const update = () =>
    fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: updateQuery,
        variables: {
          input: {
            author,
            content,
          },
          id: 1,
        },
      }),
    });
  return (
    <div>
      <Button onClick={update}>graphql改数据</Button>
      <Steps direction="vertical" current={1}>
        <Step
          status="Finished"
          title="Finished"
          description="待办事项统计TODO-LIST"
        />
        <Step status="wait" title="Waiting" description="react /lib/update" />
        <Step
          status="wait"
          title="Waiting"
          description="文章评论详情功能(设计规范的state+graphQL学习)"
        />
        <Step
          status="wait"
          title="Waiting"
          description="设计自己的组件库(TS基本语法学习)"
        />
        <Step
          status="wait"
          title="Waiting"
          description="图表组件使用(监控流量数据)"
        />
        <Step
          status="Finished"
          title="Finished"
          description="es6 用class写发布订阅模式"
        />
        <Step status="wait" title="Waiting" description="正则学习(模板引擎)" />
      </Steps>
    </div>
  );
};

const routes = [
  {
    path: '/',
    component: App,
    indexRoute: {
      component: Index,
    },
    childRoutes: [
      {
        path: 'demo',
        component: Demo,
      },
      {
        path: 'hoc',
        component: newComponent,
      },
      file,
      chat,
      todo,
    ],
  },
  login,
  NotFound,
];

export { routes };
