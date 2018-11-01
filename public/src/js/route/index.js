import Demo from 'component/reduxDemo';
import App from 'component/index';
import login from './login';
import NotFound from './404';
import file from './file';
import chat from './chat';
import { newComponent } from './hoc';
import { Steps } from 'antd';
import todo from './todo';

const Step = Steps.Step;

const Index = () => {
  return (
    <div>
      <Steps direction="vertical" current={1}>
        <Step
          status="wait"
          title="Waiting"
          description="待办事项统计TODO-LIST"
        />
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
          status="wait"
          title="Waiting"
          description="es6 用class写发布订阅模式"
        />
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
