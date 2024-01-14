import React from "react";

import { newGuid, DOCUMENT_TYPE } from "./utils";

function RenderDataItemLeftPanel(props) {
  const folderItem = props.folderItem || null;

  if (
    !folderItem ||
    (props.isMove &&
      props.selectedItems &&
      props.selectedItems.length > 0 &&
      props.selectedItems.some((item) => item.id === folderItem.id))
  )
    return null;

  const isOpened = folderItem.isOpen || false;

  const subfolder =
    (folderItem.items &&
      folderItem.items.filter(
        (item) => (item.typeName || "") === DOCUMENT_TYPE.FOLDER
      )) ||
    [];

  const loopOpenFolder = (array) => {
    return array.map((item) => {
      if (item.id === folderItem.id) {
        return {
          ...item,
          isOpen: !item.isOpen,
        };
      } else {
        const items = item.items || [];
        if (items.length > 0) {
          return {
            ...item,
            items: loopOpenFolder(items),
          };
        } else {
          return item;
        }
      }
    });
  };

  const handleOpenFolder = () => {
    const dataList = loopOpenFolder(props.rootData || []);
    props.setFileItems(dataList);
    if (folderItem.isOpen === false) {
      props.onGetAllDocumentByParentId(folderItem.id);
    }
  };

  const handleSelectFolder = () => {
    if (
      !props.isSearch &&
      props.selectedFolder &&
      props.selectedFolder.id === folderItem.id
    ) {
      return;
    }

    props.setSelectedFolder(folderItem);
    if (!props.isMove) {
      props.onGetAllDocumentByParentId(folderItem.id, props.isSearch);
    }
  };

  return (
    <div className="dx-treeview-temp">
      <div
        className={`dx-item dx-treeview-item ${
          props.selectedFolder && props.selectedFolder.name === folderItem.name
            ? "dx-filemanager-focused-item"
            : ""
        }`}
        onClick={handleSelectFolder}
      >
        <div className="dx-item-content dx-treeview-item-content">
          <i className="dx-icon dx-icon-folder"></i>
          <span className="dx-filemanager-dirs-tree-item-text">
            {folderItem.name}
          </span>
          {/* <div className="dx-filemanager-file-actions-button dx-widget">
            <div
              className="dx-button dx-button-normal dx-button-mode-text dx-widget dx-button-has-icon"
              aria-label="overflow"
              tabIndex={0}
              role="button"
            >
              <div className="dx-button-content">
                <i className="dx-icon dx-icon-overflow" />
              </div>
            </div>
          </div> */}
        </div>
      </div>
      {folderItem.hasChild && (
        <div
          className={`dx-treeview-toggle-item-visibility ${
            isOpened && "dx-treeview-toggle-item-visibility-opened"
          }`}
          onClick={handleOpenFolder}
        />
      )}
      {isOpened && (
        <RenderDataLeftPanel
          {...props}
          folderItems={subfolder}
          level={parseInt(props.level + 1).toString()}
        />
      )}
    </div>
  );
}

function RenderDataLeftPanel(props) {
  const folderItems = props.folderItems || [];
  const level = props.level || "1";
  const expanded = props.expanded || "true";
  const selected = props.selected || "false";
  const role = props.role || "treeitem";

  return (
    <ul
      className="dx-treeview-node-container dx-treeview-node-container-opened"
      role="group"
    >
      {folderItems.map((folderItem) => (
        <li
          className="dx-treeview-node dx-treeview-item-without-checkbox"
          data-item-id={`FIK_${folderItem.name}`}
          role={role}
          aria-label={folderItem.name}
          aria-expanded={expanded}
          aria-level={folderItem.parentId + "" || level}
          aria-selected={selected}
          id={newGuid()}
          key={newGuid()}
        >
          <RenderDataItemLeftPanel
            {...props}
            folderItem={folderItem}
            level={parseInt(props.level + 1).toString()}
          />
        </li>
      ))}
    </ul>
  );
}

export default function LeftPanel(props) {
  const folderItems =
    (props.fileItems &&
      props.fileItems.length > 0 &&
      props.fileItems.filter(
        (item) => (item.typeName || "") === DOCUMENT_TYPE.FOLDER
      )) ||
    [];

  return (
    <div
      className="dx-drawer-panel-content dx-drawer-panel-content-initial"
      style={{ marginLeft: "0px", width: "250px" }}
    >
      <div className="dx-filemanager-dirs-panel dx-filemanager-inactive-area">
        <div
          className="dx-filemanager-dirs-tree dx-widget dx-collection dx-treeview"
          role="tree"
          tabIndex={0}
          aria-activedescendant={newGuid()}
        >
          <div className="dx-scrollable dx-visibility-change-handler dx-scrollable-vertical dx-scrollable-simulated">
            <div className="dx-scrollable-wrapper">
              <div className="dx-scrollable-container">
                <div
                  className="dx-scrollable-content"
                  style={{
                    left: "0px",
                    top: "0px",
                    transform: "none",
                  }}
                >
                  <RenderDataLeftPanel {...props} folderItems={folderItems} />
                </div>
                <div
                  className="dx-scrollable-scrollbar dx-widget dx-scrollbar-vertical dx-scrollbar-hoverable"
                  style={{ display: "none" }}
                >
                  <div
                    className="dx-scrollable-scroll dx-state-invisible"
                    style={{
                      height: "439px",
                      transform: "translate(0px, 0px)",
                    }}
                  >
                    <div className="dx-scrollable-scroll-content" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="dx-splitter-wrapper dx-splitter-initial"
        style={{ left: "247px" }}
      >
        <div className="dx-splitter-border">
          <div className="dx-splitter dx-splitter-inactive" />
        </div>
      </div>
    </div>
  );
}
