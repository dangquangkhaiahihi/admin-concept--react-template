/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCookies } from '../../../utils/configuration';
import * as appActions from '../../../core/app.store';
import * as documentAction from '../../../redux/store/document/document.store';
import './document-settings.scss';

//--- Material Control
import {
  makeStyles,
  Typography,
  Dialog,
  AppBar,
  Toolbar,
  Button,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import { TreeItem } from '@material-ui/lab';

//--- Material Icon
import CloseIcon from '@material-ui/icons/Close';

//--- Drag

import { Transition } from '../../../utils/configuration';
import FileManagement from '../../../components/document-management/file_management';
import { useEffect } from 'react';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { UrlCollection } from '../../../common/url-collection';
import CheckboxCheckDocument from './document-check/document-check.view';
import ModalReportDocument from './document-planning-statistic/document-planning-statistic.view';

// import FileViewer from "react-file-viewer";

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    '&:hover > $content': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:focus > $content, &$selected > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: 'var(--tree-view-color)',
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label':
      {
        backgroundColor: 'transparent',
      },
  },
  content: {
    color: theme.palette.text.secondary,
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 7,
    paddingLeft: 10,
    '& $content': {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const {
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    item,
    setDocument,
    GetAllDocumentByPlanning,
    ...other
  } = props;

  return (
    <TreeItem
      onClick={() => {
        if (item.isLoaded) return;
        if (item.typeName === DOCUMENT_TYPE.FOLDER) {
          GetAllDocumentByPlanning(item.id);
        } else {
          setDocument(item);
        }
      }}
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color='inherit' className={classes.labelIcon} />
          <Typography className={classes.labelText}>{labelText}</Typography>
          <Typography variant='caption' color='inherit'>
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
  appBar: {
    position: 'relative',
    //backgroundColor: "#00923F",
  },
  title: {
    marginLeft: theme.spacing(0),
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const DOCUMENT_TYPE = {
  FOLDER: 'Folder',
  FILE: 'File',
};

function DocumentSettingsPage(props) {
  const { showLoading, settings, isQHHTKT, isQHCC } = props;

  const history = useHistory();
  const location = useLocation();
  const { id } = useParams();
  const planningId = id;
  const { name } = history.location.state || "";
  const planningName = name;
  const isLock = useLocation().state.isLock;
  const [folderList, setFolderList] = useState([]);
  const [files, setFiles] = useState([]);
  const [document, setDocument] = useState(null);
  const [openModalReport, setOpenModalReport] = useState(false);

  useEffect(() => {
    setClientSetting(settings);
  }, [settings]);

  const [clientSetting, setClientSetting] = useState(false);

  const pushToListDocumentSetting = (isQHHTKT,isQHCC) => {
    if(isQHHTKT) return UrlCollection.QH_HTKT_SETUP_DOCUMENT;
    if(isQHCC) return UrlCollection.DocumentPlanningCC;
    return UrlCollection.DocumentSetting;
  }

  const onCloseDialog = () => {
    history.push({
      pathname: pushToListDocumentSetting(isQHHTKT, isQHCC),
      state: {
        currentPage: location.state?.currentPage,
        pageSizeDefault: location.state?.pageSizeDefault,
        title: location.state?.title,
        typeSelected: location.state?.typeSelected,
        levelSelected: location.state?.levelSelected,
        statusIdSelected: location.state?.statusIdSelected,
        planningUnitSelected: location.state?.planningUnitSelected,
        investorSelected: location.state?.investorSelected,
        approvalAgencySelected: location.state?.approvalAgencySelected,
        districtSelected: location.state?.districtSelected
      }
    });
  };

  const GetAllDocumentByPlanning = (parentId = 0) => {
    showLoading(true);
    documentAction
      .GetAllDocumentByPlanning(planningId, parentId)
      .then((res) => {
        if (parentId === 0) {
          setFolderList(
            res && res.content
              ? res.content.map((item) => {
                  return {
                    ...item,
                    isLoaded: false,
                    itemList: [],
                  };
                })
              : []
          );
        } else {
          folderList &&
            folderList.length > 0 &&
            loopGetDataByParentId(
              folderList,
              res && res.content ? res.content : []
            );
        }
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
      });
  };

  const classes = useStyles();

  function loopGetDataByParentId(folderList, data) {
    let folderListTemp = [...folderList];
    for (let index = 0; index < folderListTemp.length; index++) {
      data.filter((item) => {
        if (folderListTemp[index].id === item.parentId) {
          if (folderListTemp[index].itemList.length < data.length) {
            folderListTemp[index].isLoaded = true;
            folderListTemp[index].itemList.push({
              ...item,
              itemList: [],
            });
          }
        } else {
          folderListTemp[index].type === 0 &&
            loopGetDataByParentId(folderListTemp[index].itemList, data);
        }
      });
    }
    setFolderList(folderListTemp);
    return folderListTemp;
  }

  return true ? (
    <>
      {
        // <AppBar
        //   className={classes.appBar}
        //   style={{ background: clientSetting.color }}>
        <Toolbar>
          <Typography variant='h6' className={classes.title}>
            Quản lý hồ sơ ({planningName})
          </Typography>
          <Button color='inherit' onClick={onCloseDialog}>
            <CloseIcon />
          </Button>
        </Toolbar>
        // </AppBar>
      }
      <div className="form-row">
        <div
          class={`form-group col-2 col-lg-2 'd-flex flex-column'}`}
        >
          <CheckboxCheckDocument planningId={planningId}/>
        </div>
        <div
          class={`form-group col-6 col-lg-6 'd-flex flex-column'}`}
          style={{ display: "flex" }}
        >
          <div style={{ paddingLeft: "0px" }}>
            <button
              class="btn btn-ct btn-primary-ct"
              onClick={() => {
                setOpenModalReport(true);
              }}
              style={{ color: "white", margin: "0px 0px" }}
            >
              Bảng biểu thống kê hồ sơ đồ án
            </button>
          </div>
        </div>
      </div>
      <FileManagement
        planningId={planningId}
        showLoading={showLoading}
        files={files}
        isLock={isLock}
        setFiles={setFiles}
        acceptedFiles={['.doc', '.docx', '.txt', '.pdf', '.zip', '.rar'
            ,'.gif', '.cad', '.mdb', '.shp'
        ]}
      />

      {openModalReport && (
        <ModalReportDocument
          isOpen={openModalReport}
          onClose={() => setOpenModalReport(false)}
          // data = {dataStatistic}
          planningId={planningId}
        />
      )}
    </>
  ) : (
    <div>
      <div className='text-danger text-center'>
        <HighlightOffIcon className='mt-n1 mr-1' />
        {'Không có bản ghi nào'}
      </div>
    </div>
  );
}
const mapStateToProps = (state) => ({
  isLoading: state.app.loading,
  settings: state.clientSetting.clientSetting,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showLoading: appActions.ShowLoading,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(DocumentSettingsPage);
