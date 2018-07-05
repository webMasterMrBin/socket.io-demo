// 基础组件 点击触发某些逻辑
class BaseComponent extends React.Component {
  render() {
    console.log("this.props.style", this.props.style);
    return (
      <div onClick={this.props.onClick} style={this.props.style}>
        dfdaf
        <h1>hello</h1>
      </div>
    );
  }
}

function changeComponentColor(BaseComponent, color) {
  return class NewColor extends React.Component {
    // 返回可以改变基础组件颜色的组件
    state = {
      color: "blue"
    };

    onClick = () => {
      this.setState({
        color: color
      });
    };

    render() {
      return <BaseComponent style={this.state} onClick={this.onClick} />;
    }
  };
}

const newComponent = changeComponentColor(BaseComponent, "red");

export { newComponent };
