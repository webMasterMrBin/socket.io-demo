import { Icon, Skeleton, Input, List, Avatar } from 'antd';
import { browserHistory } from 'react-router';
import { graphql, compose } from 'react-apollo';
import { getArticleDetail } from 'graphql/article/query.gql';
import { createComment } from 'graphql/article/mutation.gql';
import { Field, reduxForm } from 'redux-form';
import { InputField } from 'component/public';
import { connect } from 'react-redux';

@compose(
  graphql(getArticleDetail, {
    options(props) {
      const {
        params: { articleId },
      } = props;
      return {
        variables: {
          articleId,
        },
      };
    },
  })
)
class Index extends React.Component {
  render() {
    const {
      data: { getArticleDetail, loading, refetch },
      params: { articleId },
    } = this.props;
    return (
      <div>
        <Icon type="arrow-left" onClick={() => browserHistory.goBack()} />
        <div>
          <Skeleton loading={loading}>
            <div>title: {_.get(getArticleDetail, 'title')}</div>
            <div>content: {_.get(getArticleDetail, 'content')}</div>
            <Add refetch={refetch} articleId={articleId} />
            <List
              itemLayout="horizontal"
              dataSource={_.get(getArticleDetail, 'commentList')}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon="user" />}
                    title={item.author}
                    description={item.comment}
                  />
                </List.Item>
              )}
            />
          </Skeleton>
        </div>
      </div>
    );
  }
}

@compose(
  graphql(createComment),
  reduxForm({ form: 'create_comment' }),
  connect(state => ({ user: state.user }), () => ({}))
)
class Add extends React.Component {
  submit = v => {
    const {
      mutate,
      refetch,
      user: { userName },
      articleId,
      dispatch,
    } = this.props;
    return mutate({
      variables: {
        input: {
          author: userName,
          comment: v.comment,
          articleId,
        },
      },
    })
      .then(() => refetch())
      .then(() =>
        dispatch({
          type: 'MESSAGE_OPEN',
          messageOpen: true,
          doneMsg: '发布成功',
        })
      );
  };

  render() {
    const { submitting, handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.submit)}>
        <Field
          name="comment"
          placeholder="输入评论.."
          component={InputField}
          AntdComponent={Input}
        />
        <button
          disabled={submitting}
          type="submit"
          className="ant-btn ant-btn-primary login-btn"
        >
          上传
        </button>
      </form>
    );
  }
}

module.exports = Index;
