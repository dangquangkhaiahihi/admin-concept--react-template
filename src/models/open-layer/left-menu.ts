namespace LeftmenuModel {
  export interface ListLayer {
    groupName: string; 
    groupId: string; 
    listItems: ListLayerListItems[];
  }

  export interface ListLayerListItems {
    name: string; 
    checked: boolean; 
  }
}

export default LeftmenuModel;
