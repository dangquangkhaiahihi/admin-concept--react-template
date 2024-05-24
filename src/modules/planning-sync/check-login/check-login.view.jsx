import React, { useState } from "react";
import { useForm } from "react-hook-form";
//--- Styles
import "./check-login.css";
//--- Material Control
import {
    DialogActions,
    Button,
    TextField,
    DialogContent,
    Dialog,
    makeStyles,
    Checkbox,
} from "@material-ui/core";



const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    formControl: {
        margin: theme.spacing(1),
    },
}));

export default function CheckLoginDialog(props) {
    const classes = useStyles();

    const {
        CheckLogin,
        SetIsLogin,
        isLogin
    } = props;

    const [isRemember, setIsRemember] = useState(true);
    const { register, handleSubmit, errors, setValue } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });
    function goHomePage(){
        document.location.href="/";
    } 
    function onSubmit(data) {
        if (!data) {
            return;
        }
        console.log(data)
        let username = data.username?? "";
        let passWord = data.password?? "";
        CheckLogin(username,passWord, isRemember)
    }

    const handleChangeHot = (event) => {
        event.persist();
        setIsRemember(event.target.checked);
    }
    return (
        <div>
            <Dialog open={!isLogin} fullWidth={true} maxWidth="sm">
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" id="bg_login">
                    <div id="logo">

                        <b>Bộ xây dựng</b><br />Quản trị Thông tin quy hoạch xây dựng và quy hoạch đô thị Việt Nam
                    </div>
                    <div class="ten_ht">
                        <b>Đăng nhập hệ thống</b>
                    </div>
                    <DialogContent className="pb-2">
                        <div className="form-group">
                            <label style={{color:"white"}}>
                                 Mã truy cập<span className="required"></span>
                            </label>
                            <TextField
                                className="check-login-input"
                                name="username"
                                type="text"
                                style={{width:"50%"}}
                                inputRef={register({ required: true, maxLength: 150 })}
                                onChange={(e) =>
                                    setValue("username", e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label style={{color:"white"}}>Mật khẩu<span className="required"></span></label>
                            <TextField
                                className="check-login-input"
                                name="password"                 
                                type="password"
                                style={{width:"50%"}}
                                inputRef={register({ required: true, maxLength: 150 })}
                                inputProps={{ maxLength: 150 }}
                                onChange={(e) =>
                                    setValue("password", e.target.value)
                                }
                            />
                        </div>
                        <div className="form-group">
                                    <label style={{color:"white"}}>Lưu mật khẩu</label>
                                    <Checkbox
                                        checked={isRemember}
                                        onChange={handleChangeHot}
                                        style={{color:"white"}}
                                        inputProps={{ "aria-label": "secondary checkbox" }}
                                        className="p-0 mt-0"
                                    />
                        </div>                   
                    </DialogContent>

                    <DialogActions className="border-top">
                        <button
                            className="check-login-button"
                            type="submit"
                            onClick={goHomePage}
                            variant="contained"
                            href="/"
                        >
                            Về trang chủ
                        </button>
                        <button
                            className="check-login-button"
                            type="submit"
                            color="primary"
                            variant="contained"
                        >
                            Đăng nhập
                        </button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}
