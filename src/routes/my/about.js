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
                    borderBottom: "0px solid #ECECED"
                }}>iDream食梦</NavBar>

                <div>
                    <h3>你的建议 </h3>
                    <TextareaItem
                        placeholder="关于"
                        data-seed="logId"
                        id="titleId"
                        autoHeight
                        className={styles.title}
                        ref={el => this.customFocusInst = el}/>
                    
                    <TextareaItem rows={4} className={styles.textarea} id="contentId" placeholder="建议内容"/>
                </div>

                <Button
                    onClick={this.submit.bind(this)}
                    type="primary"
                    style={{
						margin: 10,
						backgroundColor: '#1f4ba5',
					}}>提交</Button>

                <div className={styles.iNeedYou}>
                    <br/>
                    <h3>我们在招募</h3>
                    <p>合伙人<br/>
                    技术iOS Android Web<br/>
                    产品设计</p><br/>
                    <h3>我们是谁</h3>
                    <p>我们是着迷梦境的人类<br/>
                    我们相信梦中有着乐趣和启发<br/>
                    我们相信梦的科研和艺术价值<br/>
                    </p><br/>
                    <h3>我们从哪里来</h3>
                    <p>梦伴随着我们人类从古至今<br/>
                    我们从生至死<br/>
                    从入睡到苏醒<br/>
                    影响着我们记忆/学习/解决问题的方式<br/>
                    让我们认识这生命中重要的组成部分<br/>
                    </p><br/>
                        
                    <h3>我们到哪里去</h3>
                    <p>集合连接全世界的梦<br/>
                    去享受当中的乐趣和感悟<br/>
                    甚至量子纠缠让我们相信梦中情景存在真实联系<br/>
                    <br/>
                    
                    梦也是私隐性极高的人生探秘<br/>
                    我们努力不懈为大家发现梦境的意义与价值<br/>
                    <br/>
                    idreamin@outlook.com<br/>

                    </p>






                </div>
            </div>
        )
    }

    submit = () => {
        const title = document.getElementById("titleId").value;
        // const contact = document.getElementById("contactId").value;
        const content = document.getElementById("contentId").value;

        // if(title =="" || contact == "" || content == ""){
           if(title =="" || content == ""){ 
            Toast.info('请把消息填写完整', 1);
        }else{

            this.props.dispatch({ type:'my/addOpinion',payload:{
                title:title,
                content:content,
                // contact_info:contact
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
