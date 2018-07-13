- react 生命周期整理
- 生命周期顺序
  - 出生(Mount)阶段
    1. componentWillMount
      - 可以setState 第一次render的state 以该处为准
    2. render
    3. componentDidMount
      - 可以setState 将会触发Update的生命周期, 可访问DOM元素
  - 更新阶段(Update)(props和state的更改)
    1. componentWillReceiveProps
      - 收到新的props调用 新旧props相同也会调用
    2. shouldComponentUpdate
      - 判断更新阶段的其他生命周期willUpdate, didUpdate, render是否执行
    3. componentWillUpdate(nextProps, nextState)
    4. componentDidUpdate(prevProps, prevState)


- 静态方法 static getDerivedStateFromProps 和 componentWillReceiveProps区别
    - getDerivedStateFromProps调用的几种场景
      1. 组件实例化之后调用
      2. 接受到新的属性
      3. setState后调用(React > 16.4.0)
      4. 父组件重渲
    - componentWillReceiveProps
      1. 发生在组件update阶段(接受到新属性, 前后属性值相等也会更新)
