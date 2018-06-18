import React from "react";
import { connect } from "dva";
import { Link } from 'dva/router';
import { browserHistory } from 'react-router';
import { Icon, List, InputItem, Button, Toast } from "antd-mobile";
import styles from "./login.less";
import NavBarPage from "../../components/NavBar"

class Login extends React.Component {
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
            <b>连接全世界的梦</b>
            <p>
            记录、分享、交流
            </p>
          </div>
          <List>
            <InputItem
              className={styles.text}
              id="username"
              ref={el => this.username = el}
              placeholder="邮箱"
            >
              {/* <div className={styles.iconUser} /> */}
            </InputItem>
            <InputItem
              className={styles.text}
              id="password"
              type="password"
              placeholder="密 码"
            >
              {/* <div className={styles.iconPwd} /> */}
            </InputItem>
          </List>
          <Button className={styles.loginBtn} type="primary" onClick={this.onSubmit}>登入</Button>

          <Link to="/forget" className={styles.forgetPwd}><span>忘记密码</span></Link>

          <Link to="/register"><Button type="ghost" className={styles.registerBtn}><span>创建账户</span></Button></Link>

          <Link to="/" className={styles.forgetPwd}><span>无登入浏览</span></Link>

        </div>
      </div>

    )
  }

  // 登录
  onSubmit=()=>{

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username == "") {
      Toast.info("输入用户名", 1);
    } else if (password == "") {
      Toast.info("输入密码", 1);
    } else {
      //开始登录
      Toast.loading("登入中",5);
      this.props.dispatch({'type':'user/login','payload':{'name':username,'password':password}});
    }
  }
}

function mapStateToProps(state) {
  return {
    ...state.user
  };
}

export default connect(mapStateToProps)(Login);
