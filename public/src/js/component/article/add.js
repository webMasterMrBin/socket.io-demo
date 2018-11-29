import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { createArticle } from 'graphql/article/mutation.gql';
import { getArticleList } from 'graphql/article/query.gql';
import { Input } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { InputField } from 'component/public';
import PropTypes from 'prop-types';

const validate = value => {
  const errors = {};
  if (!value.title) {
    errors.title = 'title不能为空 ';
  }
  if (!value.content) {
    errors.content = 'content不能为空';
  }
  if (!value.description) {
    errors.description = 'description不能为空';
  }
  return errors;
};

// NOTE ES7 装饰器特性 Index = compose()(Index) Index must me a Class
@compose(
  graphql(createArticle),
  graphql(getArticleList),
  reduxForm({ form: 'create_article', validate }),
  connect(state => ({ user: state.user }), () => ({}))
)
class Index extends React.Component {
  static propTypes = {
    mutate: PropTypes.func,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    user: PropTypes.object,
  };

  submit = v => {
    const {
      mutate,
      user: { userName },
      data: { refetch },
      dispatch,
    } = this.props;
    return mutate({
      variables: {
        input: {
          author: userName,
          content: v.content,
          title: v.title,
          description: v.description,
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
    const { handleSubmit, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit(this.submit)}>
        <Field
          name="title"
          placeholder="请输入文章标题"
          component={InputField}
          AntdComponent={Input}
        />
        <Field
          name="description"
          placeholder="请输入文章概览"
          component={InputField}
          AntdComponent={Input}
        />
        <Field
          name="content"
          placeholder="请输入文章内容"
          autosize={{ minRows: 6, maxRows: 10 }}
          component={InputField}
          AntdComponent={Input.TextArea}
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

export default Index;
