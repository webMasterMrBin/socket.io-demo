import { graphql, compose } from 'react-apollo';
import { getArticleList } from 'graphql/article/query.gql';
import { List, Avatar, Skeleton, Icon } from 'antd';
import { browserHistory } from 'react-router';

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

@compose(graphql(getArticleList))
class Index extends React.Component {
  render() {
    const {
      data: { loading, getArticleList },
    } = this.props;
    return (
      <div>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={getArticleList}
          renderItem={item => (
            <List.Item
              key={item.title}
              className="article-item"
              actions={[<IconText key={1} type="message" text="2" />]}
              onClick={() =>
                browserHistory.push(`/article/detail/${item.articleId}`)
              }
            >
              <Skeleton loading={loading} active avatar>
                <List.Item.Meta
                  avatar={<Avatar icon="user" />}
                  title={<a href={item.href}>{item.title}</a>}
                  description={item.author}
                />
                {item.description}
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default Index;
