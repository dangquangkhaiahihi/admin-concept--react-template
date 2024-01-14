export const ACTION_TYPES = {
  MOVE: "MOVE",
  COPY: "COPY",
  RENAME: "RENAME",
  DELETE: "DELETE",
  DOWNLOAD: "DOWNLOAD",
  CREATE_FOLDER: "CREATE_FOLDER",
  UPLOAD_FILE: "UPLOAD_FILE",
  PREVIEW_FILE: "PREVIEW_FILE",
};

export const DOCUMENT_TYPE = {
  FOLDER: "Folder",
  FILE: "File",
};

export const FILE_EXTENSION = [
  "doc",
  "docx",
  "ppt",
  "pdf",
  "xlsx",
  "tif",
  "dwg",
  "dng",
  "png",
  "jpg",
  "jpeg",
  "xls",
  "pptx",
  "txt",
];

export const FILE_EXTENSION_ICON = {
  DOC: "doc",
  DOCX: "docx",
  PPT: "ppt",
  PDF: "pdf",
  XLSX: "xlsx",
  TIF: "tif",
  DWG: "dwg",
  DNG: "dng",
  PNG: "png",
  JPG: "jpg",
  JPEG: "jpeg",
  XLS: "xls",
  PPTX: "pptx",
  TXT: "txt",
};

export const DefaultData = [
  {
    id: -1,
    parentId: -1,
    pathIds: [-1],
    name: "Kho tài liệu",
    path: "/Kho tài liệu",
    typeName: "Folder",
    isOpen: false,
    hasChild: true,
    isSearch: false,
    items: [],
  },
];

export const DefaultDataSearch = [
  {
    id: -1,
    parentId: -1,
    pathIds: [-1],
    name: "Kết quả tìm kiếm",
    path: "/Kết quả tìm kiếm",
    typeName: "Folder",
    isOpen: false,
    hasChild: true,
    isSearch: true,
    items: [],
  },
];

export const FakeData = [
  {
    id: -1,
    parentId: -1,
    pathIds: [-1],
    name: "Kho tài liệu",
    path: "/Kho tài liệu",
    typeName: "Folder",
    isOpen: false,
    items: [
      {
        id: 1,
        parentId: 0,
        pathIds: [1],
        name: "Documents",
        path: "/Documents",
        typeName: "Folder",
        isOpen: false,
        items: [
          {
            id: 2,
            parentId: 1,
            pathIds: [1, 2],
            name: "Documents2",
            path: "/Documents/Documents2",
            typeName: "Folder",
            isOpen: false,
            items: [
              {
                id: 16,
                parentId: 2,
                pathIds: [1, 2, 16],
                name: "About",
                path: "/Documents/Documents2/About",
                typeName: "Folder",
                isOpen: false,
              },
              {
                id: 3,
                parentId: 2,
                pathIds: [1, 2, 3],
                name: "About.doc",
                path: "/Documents/Documents2/About.doc",
                extension: "doc",
                typeName: "File",
                size: 1024,
              },
              {
                id: 4,
                parentId: 2,
                pathIds: [1, 2, 4],
                name: "Passwords.rtf",
                path: "/Documents/Documents2/Passwords.rtf",
                typeName: "File",
                size: 2048,
              },
            ],
          },
          {
            id: 5,
            parentId: 1,
            pathIds: [1, 5],
            name: "About.xml",
            path: "/Documents/About.xml",
            typeName: "File",
            size: 1024,
          },
          {
            id: 6,
            parentId: 1,
            pathIds: [1, 6],
            name: "Managers.rtf",
            path: "/Documents/Managers.rtf",
            typeName: "File",
            size: 2048,
          },
          {
            id: 7,
            parentId: 1,
            pathIds: [1, 7],
            name: "ToDo.txt",
            path: "/Documents/ToDo.txt",
            typeName: "File",
            size: 3072,
          },
        ],
      },
      {
        id: 8,
        parentId: 0,
        pathIds: [8],
        name: "Images",
        path: "/Images",
        typeName: "Folder",
        isOpen: false,
        items: [
          {
            id: 9,
            parentId: 8,
            pathIds: [8, 9],
            name: "logo.png",
            path: "/Images/logo.png",
            typeName: "File",
            size: 20480,
          },
          {
            id: 10,
            parentId: 8,
            pathIds: [8, 10],
            name: "banner.gif",
            path: "/Images/banner.gif",
            typeName: "File",
            size: 10240,
          },
        ],
      },
      {
        id: 11,
        parentId: 0,
        pathIds: [11],
        name: "System",
        path: "/System",
        typeName: "Folder",
        isOpen: false,
        items: [
          {
            id: 12,
            parentId: 11,
            pathIds: [11, 12],
            name: "Employees.txt",
            path: "/System/Employees.txt",
            typeName: "File",
            size: 3072,
          },
          {
            id: 13,
            parentId: 11,
            pathIds: [11, 13],
            name: "PasswordList.txt",
            path: "/System/PasswordList.txt",
            typeName: "File",
            size: 5120,
          },
        ],
      },
      {
        id: 14,
        parentId: 0,
        pathIds: [14],
        name: "Description.rtf",
        path: "/Description.rtf",
        typeName: "File",
        size: 1024,
      },
      {
        id: 15,
        parentId: 0,
        pathIds: [15],
        name: "Description.txt",
        path: "/Description.txt",
        typeName: "File",
        size: 2048,
      },
    ],
  },
];

export const maxWidthDialog = (fileLength = 0) => {
  switch (fileLength) {
    case 0:
    case 1:
      return "sm";
    case 2:
    case 3:
      return "md";
    default:
      return "lg";
  }
};

export const newGuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const isValidFile = (_file = null, _acceptedFiles = []) => {
  if (!_file || !_acceptedFiles) return false;

  if (_acceptedFiles.length === 0) return true;

  if (
    _file.typeName === DOCUMENT_TYPE.FOLDER ||
    (_file.extension &&
      _acceptedFiles.some(
        (fileType) =>
          fileType.toLowerCase() === _file.extension.toLowerCase()
      ))
  ) {
    return true;
  }

  return false;
};

export const isValidFileSelect = (_file = null, _acceptedFiles = []) => {
  if (!_file || !_acceptedFiles || _acceptedFiles.length === 0) return false;

  if (
    _file.typeName === DOCUMENT_TYPE.FILE &&
    _file.extension &&
    _acceptedFiles.some(
      (fileType) =>
        fileType.toLowerCase() === _file.extension.toLowerCase()
    )
  )
    return true;

  return false;
};

export function compareValues(key, order = "asc") {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
}
