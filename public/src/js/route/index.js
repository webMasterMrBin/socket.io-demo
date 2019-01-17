import Demo from 'component/reduxDemo';
import App from 'component/index';
import login from './login';
import NotFound from './404';
import file from './file';
import chat from './chat';
import { newComponent } from './hoc';
import { Steps } from 'antd';
import todo from './todo';
import article from './article';
import mockup from './mockup';

const Step = Steps.Step;

const Index = () => {
  return (
    <div>
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
      article,
    ],
  },
  mockup,
  login,
  NotFound,
];

export { routes };
