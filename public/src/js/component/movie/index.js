// const request = require('request');
// import request from 'request';
class Index extends React.Component {
  state = {
    arr: [],
  };

  componentDidMount() {
    fetch('/api/getAllMovie')
      .then(res => res.json())
      .then(d => this.setState({ arr: d }));
  }

  render() {
    console.log('state', this.state.arr);
    return (
      <div>
        {this.state.arr.length !== 0 &&
          this.state.arr.map(o => (
            <div key={o.title}>
              <span>{o.title}</span>
              <a href={o.download}>下载地址: {o.download}</a>
              <a href={o.link}>详情: {o.link}</a>
            </div>
          ))}
      </div>
    );
  }
}

module.exports = Index;
