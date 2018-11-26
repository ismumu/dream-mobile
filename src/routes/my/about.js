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
                }}>iDream食夢</NavBar>

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
                    <h3>我们是谁</h3>
                    <p>我们是着迷梦境的人类<br/>
                    因为我们相信梦中有着乐趣和启发<br/>
                    </p><br/>

                    <h3>我们从哪里来</h3>
                    <p>梦伴随着我们人类从古至今·从生至死<br/>
                    我们生命1/4时间在睡眠中度过<br/>
                    其中1/4睡眠时间在做梦<br/>
                    为嘛不认识组成我们生命的1/16<br/>
                    </p><br/>
                        
                    <h3>我们到哪里去</h3>
                    <p>集合连接全世界的梦<br/>
                    去享受梦中愉悦、启发、甚至悲伤中感悟人生<br/>
                    甚至量子纠缠让我们相信梦中情景存在真实联系<br/>
                    <br/>
                    
                    梦也是私隐性极高的人生探秘<br/>
                    我们努力不懈为大家发现梦境的意义与价值<br/>
                    idreamin@outlook.com<br/>
                    【连接全世界的梦】<br/>
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
