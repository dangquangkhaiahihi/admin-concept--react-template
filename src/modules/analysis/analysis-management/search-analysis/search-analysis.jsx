import React,{ useEffect } from 'react';
import 'date-fns';
import { useForm } from 'react-hook-form';
import { Configs } from '../../../../common/config';
function SearchAnalysis(props) {
  const { onGetList, pageSize, refresh } = props;
  const { handleSubmit } = useForm({
    mode: 'all',
    reValidateMode: 'onBlur',
  });
  const [title, setTitle] = React.useState('');
  var styles = {
    firstBtn: {
      margin: 0
    },
  }
  const onSubmit = async () => {
    await onGetList(1, pageSize, Configs.DefaultSortExpression, title);
  };

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const refreshSearch = () => {
    setTitle('');
    refresh();
  };

  return (
    <div class='wrap__content-page qlhs-form'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div class='form-row'>
          <div class='form-group col-12 col-lg-6'>
            <input
              id='input-search'
              type='text'
              value={title}
              onChange={onChangeTitle}
              class='form-control'
              placeholder='Tên phân tích'
            />
          </div>
          <div class='form-group col-12 col-lg-6'>
          <button class='btn btn-ct btn-default-ct btn-inline' style={styles.firstBtn} onClick={refreshSearch}>
            Xóa
          </button>
          <button class='btn btn-ct btn-primary-ct btn-inline'  type='submit'>
            Tìm kiếm
          </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SearchAnalysis;
