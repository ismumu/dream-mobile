import React from "react";
import { connect } from "dva";
import { Link } from 'dva/router';
import { browserHistory } from 'react-router';
import { Icon, List, InputItem, Button, Toast } from "antd-mobile";
import styles from "./login.less";
import NavBarPage from "../../components/NavBar"

class Register extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
    };
  }

  render() {
    return (
      <div>
        <NavBarPage isFly="false" />
        <div className={styles.loginWrap}>
          <div className={styles.title}>
            <b>记录、分享、交流梦境</b>
          </div>
          <List>
            <InputItem
              className={styles.text}
              id="username"
              ref={el => this.username = el}
              placeholder="名字"
            >
            </InputItem>
            <InputItem
              className={styles.text}
              id="email"
              ref={el => this.username = el}
              placeholder="邮箱"
            >
            </InputItem>
            <InputItem
              className={styles.text}
              id="password"
              type="password"
              placeholder="密码"
            >

              {/* <div className={styles.iconPwd} /> */}
            </InputItem>
            <InputItem
              className={styles.text}
              id="password2"
              type="password"
              placeholder="密码确认"
            >

              {/* <div className={styles.iconPwd} /> */}
            </InputItem>
          </List>
          <Button className={styles.loginBtn} type="primary" onClick={this.onSubmit}>创建</Button>

          <Link to="/login" className={styles.forgetPwd}><span>返回</span></Link>

          {/* <Link to=""><Button type="ghost"  className={styles.registerBtn}><span>创建账户</span></Button></Link> */}

        </div>

      </div>
    )
  }

  onSubmit=()=>{

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;

    const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;

    if (username == "") {
      Toast.info("输入用户名", 1);
    }
    else if (email == "") {
      Toast.info("输入邮箱", 1);
    }
    else if(!reg.test(email)){
      Toast.info("邮箱格式不对", 1);
    }
    else if (password == "") {
      Toast.info("密码", 1);
    }
    else if (password2 == "") {
      Toast.info("密码确认", 1);
    }
    else if (password2.length <6 || password.length <6) {
      Toast.info("密码大于6位数", 1);
    }
    else if (password2 !== password) {
      Toast.info("密码不一致！", 1);
    } else {
      this.props.dispatch({
        'type': 'user/register',
        'payload': {
          'name':username,
          'email':email,
          'password':password,
          'repassword':password2
        }
      });
    }
  }
}

function mapStateToProps(state) {
  return {
    ...state.user
  };
}
export default connect(mapStateToProps)(Register);
