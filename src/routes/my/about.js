import React from "react";
import {connect} from "dva";
import {
    List,
    NavBar,
    Button,
    Icon,
    Toast,
    TextareaItem
} from "antd-mobile";
import styles from "./about.less";

const Item = List.Item;

class About extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            setup: {
                review: false,
                transmit: false,
                praise: false,
                keep: false,
                personalLetter: false,
                newfollow: false
            }
        }
    }

    render() {
        return (
            <div className={styles.aboutWrap}>
                <NavBar
                    mode="light"
                    icon={< Icon type = "left" />}
                    onLeftClick={() => history.go(-1)}
                    style={{
                    borderBottom: "1px solid #ECECED"
                }}>关于我</NavBar>

                <div>
                    <h3>你的建议 </h3>
                    <TextareaItem
                        placeholder="关于"
                        data-seed="logId"
                        id="titleId"
                        autoHeight
                        className={styles.title}
                        ref={el => this.customFocusInst = el}/>
                    <TextareaItem
                        placeholder="你的联系方式"
                        data-seed="logId"
                        id="contactId"
                        autoHeight
                        className={styles.title}
                        ref={el => this.customFocusInst = el}/>
                    <TextareaItem rows={4} className={styles.textarea} id="contentId" placeholder="建议内容"/>
                </div>

                <Button
                    onClick={this.submit.bind(this)}
                    type="primary"
                    style={{ margin: 20}}>提交</Button>

                <div className={styles.iNeedYou}>
                    <h3>为什么建立</h3>
                    <b>我们相信连接全世界的梦能产生趣味和价值<br/>
                       因为梦境是人类大思维最无厘头和最多火花的地方</b>
                    
                    <h3>加入我们</h3>
                    <b>梦的趣味天马行空<br/>
                        梦的价值具治愈和发现心理真相<br/>
                        若你和我们一样认同梦这样的积极功能<br/>
                        立即加入我们<br/>
                        为之奋斗创造更具趣味和意义价值的现实世界<br/>
                    
                        Call me babe<br/>
                        期待与你畅谈<br/>
                        idreamin@outlook.com</b>

                

                  




                </div>
            </div>
        )
    }

    submit = () => {
        const title = document.getElementById("titleId").value;
        const contact = document.getElementById("contactId").value;
        const content = document.getElementById("contentId").value;

        if(title =="" || contact == "" || content == ""){
            Toast.info('请把消息填写完整', 1);
        }else{
            
            this.props.dispatch({ type:'my/addOpinion',payload:{
                title:title,
                content:content,
                contact_info:contact
            }});
        }
    }
}

function mapStateToProps(state) {
    return {
        ...state.my
    };
}

export default connect(mapStateToProps)(About);
