import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Consult from "./consult.view";
import "./dashboard.scss";
import Planning from "./planning.view";
import * as dashboardAction from './../../redux/store/dashboard/dashboard.store';
import PlanningUnit from "./planningUnit.view";
import DateFnsUtils from "@date-io/date-fns";
import viLocale from "date-fns/locale/vi";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import PlanningCoverage from "./planningCoverage.view";
import AreaOfLand from "./areaOfLand.view";
import TypeStatistics from "./typeStatistics.view";

const today = new Date();

const PAYLOAD_30DAYS_AGO = {
    fromDate: new Date(new Date().setDate(today.getDate() - 30)),
    toDate: today
}

const PAYLOAD_CURRENT_YEAR = {
    fromDate: new Date(new Date().getFullYear(), 0, 1),
    toDate: today
}

const PAYLOAD_BEFORE_YEAR = {
    fromDate: new Date(new Date().getFullYear() - 1, 0, 1),
    toDate: new Date(new Date().getFullYear() - 1, 11, 31)
}

const filters = [
    { value: 1, label: '30 ngày qua', selected: true },
    { value: 2, label: 'Năm nay' },
    { value: 3, label: 'Năm trước' },
    { value: 4, label: 'Tùy chọn' },
]

const Dashboard = () => {
    const [planningStatistics, setPlanningStatistics] = useState([]);
    const [planningConsultantingStatistics, setPlanningConsultantingStatistics] = useState([]);
    const [planningByUnitStatistics, setPlanningByUnitStatistics] = useState([]);
    const [planningCoverageStatisticsGeneral, setPlanningCoverageStatisticGeneral] = useState([]);
    const [planningCoverageStatisticsDetail, setPlanningCoverageStatisticDetail] = useState([]);
    const [areaOfLandStatistics, setAreaOfLandStatistics] = useState([]);
    const [planningByTypeStatistics, setPlanningByTypeStatistics] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showOptionDate, setShowOptionDate] = useState(false);

    const GetPlanningStatistics = (payload) =>
        dashboardAction.GetPlanningStatistics(payload).then((res) => setPlanningStatistics(res.content))

    const GetPlanningConsultantingStatistics = (payload) =>
        dashboardAction.GetPlanningConsultantingStatistics(payload).then((res) => setPlanningConsultantingStatistics(res.content))

    const GetPlanningByUnitStatistics = (payload) =>
        dashboardAction.GetPlanningByUnitStatistics(payload).then((res) => setPlanningByUnitStatistics(res.content))

    const GetPlanningCoverageStatisticsGeneral = (payload) =>
        dashboardAction.GetPlanningCoverageStatistics(payload, 2).then((res) => setPlanningCoverageStatisticGeneral(res.content))

    const GetPlanningCoverageStatisticsDetail = (payload) =>
        dashboardAction.GetPlanningCoverageStatistics(payload, 3).then((res) => setPlanningCoverageStatisticDetail(res.content))

    const GetAreaOfLandStatistics = () =>
        dashboardAction.GetAreaOfLandStatistics().then((res) => setAreaOfLandStatistics(res.content))

    const GetPlanningByTypeStatistics = (payload) =>
        dashboardAction.GetPlanningByTypeStatistics(payload).then((res) => setPlanningByTypeStatistics(res.content))

    const onFilter = (e) => {
        setStartDate(null);
        setEndDate(null);
        setShowOptionDate(parseInt(e.target.value) === 4)
        switch (parseInt(e.target.value)) {
            case 1:
                getData(PAYLOAD_30DAYS_AGO)
                break;
            case 2:
                getData(PAYLOAD_CURRENT_YEAR)
                break;
            case 3:
                getData(PAYLOAD_BEFORE_YEAR)
                break;
            default:
        }
    }

    const getData = (payload, isCallAreaOfLand = false) => {
        if (isCallAreaOfLand) {
            GetAreaOfLandStatistics();
        }
        GetPlanningStatistics(payload);
        GetPlanningConsultantingStatistics(payload);
        GetPlanningByUnitStatistics(payload);
        GetPlanningCoverageStatisticsGeneral(payload);
        GetPlanningCoverageStatisticsDetail(payload);
        GetPlanningByTypeStatistics(payload)
    }

    useEffect(() => {
        getData(PAYLOAD_BEFORE_YEAR, true);
    }, [])

    useEffect(() => {
        if (showOptionDate) {
            const payload = {
                fromDate: startDate ? new Date(startDate) : null,
                toDate: endDate ? new Date(endDate) : null
            }
            getData(payload);
        }
    }, [showOptionDate, startDate, endDate])

    return (
        <div>
            <Grid container spacing={1} style={{ maxHeight: 600 }}>
                <Grid item xs={2}>
                    <select
                        class='custom-select'
                        onChange={onFilter}
                        style={{width:"unset"}}
                        title="filter-dashboard"
                    >
                        {filters.map((x) => (
                            <option value={x.value} selected={x?.selected}>{x.label}</option>
                        ))}
                    </select>
                </Grid>
                {showOptionDate &&
                    <>
                        <Grid item xs={2}>
                            <MuiPickersUtilsProvider
                                utils={DateFnsUtils}
                                locale={viLocale}
                            >
                                <DatePicker
                                    id="startDate"
                                    placeholder="Từ ngày"
                                    name="startDate"
                                    format="dd/MM/yyyy"
                                    onChange={(date) => date && setStartDate(date)}
                                    value={startDate}
                                    fullWidth
                                    showTodayButton
                                    rightArrowIcon
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={2}>
                            <MuiPickersUtilsProvider
                                utils={DateFnsUtils}
                                locale={viLocale}
                            >
                                <DatePicker
                                    id="startDate"
                                    name="startDate"
                                    placeholder="Đến ngày"
                                    format="dd/MM/yyyy"
                                    onChange={(date) => date && setEndDate(date)}
                                    value={endDate}
                                    fullWidth
                                    showTodayButton
                                    minDate={startDate}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </>
                }
            </Grid>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={8}>
                    <AreaOfLand data={areaOfLandStatistics} isExpanDiv={planningByTypeStatistics?.length > 0} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TypeStatistics data={planningByTypeStatistics} isExpanDiv={areaOfLandStatistics?.length > 0} />
                </Grid>
            </Grid>
            <Grid container spacing={1} className="mt-1">
                <Grid item xs={12} sm={4}>
                    <Planning data={planningStatistics} isStatement />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Consult data={planningConsultantingStatistics} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Planning data={planningStatistics} />
                </Grid>
            </Grid>
            <Grid container spacing={1} className="mt-1">
                <Grid item xs={12}>
                    <PlanningCoverage data={planningCoverageStatisticsGeneral} isOtherPlanning />
                </Grid>
            </Grid>
            <Grid container spacing={1} className="mt-1">
                <Grid item xs={12}>
                    <PlanningCoverage data={planningCoverageStatisticsDetail} />
                </Grid>
            </Grid>
            <Grid container spacing={1} className="mt-1">
                <Grid item xs={12}>
                    <PlanningUnit data={planningByUnitStatistics} />
                </Grid>
            </Grid>
        </div>
    )
}

export default Dashboard;
