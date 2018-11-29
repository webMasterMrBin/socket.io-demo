import Add from './add';
import List from './list';

const Index = props => {
  return (
    props.children || (
      <div>
        <Add />
        <List />
      </div>
    )
  );
};

module.exports = Index;
