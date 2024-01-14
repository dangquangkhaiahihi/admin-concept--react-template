import React from 'react';
import './layout.scss';
import Sidebar from '../sidebar/sidebar.view.jsx';
import TopBar from '../topbar/topbar.view.jsx';
import LoadingScreen from '../loading-with-queue/loading-with-queue';
import PageTitle from '../page-title/page-title.view';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

interface IState {
  isDirty?: boolean;
}

class LayoutView extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = { isDirty: false };
  }

  setToggle = () => {
    this.setState((state) => ({
      isDirty: !state.isDirty,
    }));
  };

  render() {
    const {reactMediaQuery} = this.props

    return (
      <div id='wrapper flex-column'>
        <LoadingScreen />
        <TopBar setToggle={this.setToggle} reactMediaQuery={reactMediaQuery}/>

        <div
          id='content-wrapper'
          className='d-flex flex-column content-wrapper'>
          <div id='content' className='d-flex content'>
            <Sidebar isDirty={this.state.isDirty} setToggle={this.setToggle}/>
            <div className={
              `${reactMediaQuery?.isTabletOrMobile && 'content'} ${!reactMediaQuery?.isTabletOrMobile ? 'right-content' : ''} container-fluid ${(!this.state.isDirty && !this.props.isCollapsed) ? 'center' : ''}`
            }
             >
              <PageTitle setToggle={this.setToggle} title={this.props.title} reactMediaQuery={reactMediaQuery}/>
              <div className='child'>{this.props.children}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  isCollapsed: state.app.isCollapsed,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LayoutView);
