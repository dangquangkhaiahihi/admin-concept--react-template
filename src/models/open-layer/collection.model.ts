namespace CollectionModel {
  export interface Collection {
    
    changed: Function;
    clear: FuncionWithoutParams; 
    dispatchEvent: Function;
    extend: Function; 
    forEach: Function;
    get: GetModel; 
    getArray: FuncionWithoutParams;
    getKeys: FuncionWithoutParams; 
    getLength: FuncionWithoutParams;
    getProperties: FuncionWithoutParams; 
    getRevision: FuncionWithoutParams;
    insertAt: InsertAtModel; 
    item: ItemModel; 
    on: Function;
    once: Function;
    pop: FuncionWithoutParams; 
    push: Function; 
    remove: RemoveModel; 
    removeAt: RemoveAtModel; 
    set: Function;
    setAt: SetAtModel; 
    setProperties: Function;
    un: Function;
    unset: Function;
  }

  interface SetAtModel {
    (index: number, element: any): any;
  }

  interface RemoveAtModel {
    (index: number): any | undefined;
  }

  interface RemoveModel {
    (element: any): any | undefined;
  }

  interface ItemModel {
    (index: number): any;
  }

  interface InsertAtModel {
    (index: number, element: any): any;
  }

  interface GetModel {
    (key: string): any;
  }

  interface FuncionWithoutParams {
    (): any;
  }
}

export default CollectionModel;
