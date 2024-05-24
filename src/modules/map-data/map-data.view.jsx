import React, { useState } from 'react';

//--- Material Control
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import Fab from '@material-ui/core/Fab';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';

//--- Material Icon
import AddCircle from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import ClearAllIcon from '@material-ui/icons/ClearAll';

//--- Component
import ListMapData from './list-map-data/list-map-data.view';
import AddMapData from './add-map-data/add-map-data.view';
import EditMapData from './edit-map-data/edit-map-data.view';
import DeleteDialog from '../../components/dialog-delete/dialog-delete.view';


const rows = [
    { mapId: 1, mapName: 'Bản đồ cảnh báo', mapOwner: 'System', modifiedDate: '15h00 18/07/2020' },
    { mapId: 2, mapName: 'Bản đồ điểm nóng', mapOwner: 'System', modifiedDate: '15h00 19/07/2020' },
    { mapId: 3, mapName: 'Bản đồ nguồn thải', mapOwner: 'System', modifiedDate: '15h00 20/07/2020' },
    { mapId: 4, mapName: 'Bản đồ quan trắc', mapOwner: 'System', modifiedDate: '15h00 21/07/2020' },
    { mapId: 5, mapName: 'Bản đồ nguồn thải (thử nghiệm)', mapOwner: 'System', modifiedDate: '15h00 2/07/2020' },
];

export default function MapData() {
    //--- Dialog
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
    };

    const handleOpenEditDialog = () => {
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    //--- Filter
    const [filterSection, setFilterSection] = useState(null);
    const handleClickFilter = (event) => {
        setFilterSection(event.currentTarget);
    };

    const handleCloseFilter = () => {
        setFilterSection(null);
    };

    return (
        <div className="map-data">
            <div className="d-sm-flex align-items-center justify-content-between mb-3">
                <h1 className="h3 mb-0 text-gray-800">
                    <Tooltip title="Tìm kiếm">
                        <Fab color="primary" aria-label="filter" size="small" onClick={handleClickFilter} className="ml-2">
                            <FilterListIcon />
                        </Fab>
                    </Tooltip>
                    <Menu
                        id="filter-menu"
                        anchorEl={filterSection}
                        keepMounted
                        open={Boolean(filterSection)}
                        onClose={handleCloseFilter}
                        TransitionComponent={Fade}
                    >
                        <div className="p-3">
                            <div className="text-right">
                                <IconButton aria-label="close" size="small" onClick={handleCloseFilter}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </div>
                            <form>
                                <div className="form-group">
                                    <label className="text-dark">Tên bản đồ</label>
                                    <TextField className="w-100" />
                                </div>

                                <div className="border-top">
                                    <div className="row">
                                        <div className="col-12 text-right mt-3">
                                            <Button variant="contained" color="primary" onClick={handleCloseFilter}>
                                                <SearchIcon fontSize="small" /> Tìm kiếm
                                            </Button>
                                            <Button variant="contained" className="ml-2">
                                                <ClearAllIcon fontSize="small" /> Bỏ lọc
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Menu>
                </h1>
                <Button variant="contained" color="primary" onClick={handleOpenAddDialog} startIcon={<AddCircle />}>Tạo bản đồ</Button>
            </div>

            <ListMapData
                rows={rows}
                editAction={handleOpenEditDialog}
                deleteAction={handleOpenDeleteDialog}
            />

            {openAddDialog && (
                <AddMapData
                    isOpen={openAddDialog}
                    onClose={handleCloseAddDialog}
                    onSuccess={handleCloseAddDialog}
                />
            )}

            {openEditDialog && (
                <EditMapData
                    isOpen={openEditDialog}
                    onClose={handleCloseEditDialog}
                    onSuccess={handleCloseEditDialog}
                />
            )}

            {openDeleteDialog && (
                <DeleteDialog
                    isOpen={openDeleteDialog}
                    onClose={handleCloseDeleteDialog}
                    onSuccess={handleCloseDeleteDialog}
                    header={"Xóa bản đồ"}
                    content={"Bạn có chắc chắn muốn xóa?"}
                />
            )}
        </div>
    )
}