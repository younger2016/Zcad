/**
 * Created by wxk on 2016/7/18.
 */
import React,{ Component } from 'react';
import {
    Navigator,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    ScrollView,
    Alert,
    ListView
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import * as actions from '../actions/cell';
import * as projectActions from '../redux/project';
import * as loginActions from '../actions/login';
import Cell from './Cell';


const FieldType = {
    typeID : 'int',
    typeName : 'string',
} 

class WelcomeView extends Component {
    constructor(props){
        super(props);
        this.projectList = [];
        //console.log("loadData");
        this.loadData();
    }


    //点击工程
    onPressMap(value){
        let {loginactions,login,projectActions} = this.props;
        let projectid = login.userid+'-'+value;
        //console.log(login);
        projectActions.SetProject(value);

        storage.load({
                key: 'projectid',
                id:projectid,
                autoSync: false,//true,
                syncInBackground: false,//true
            })
            .then(ret => {
                loginactions.getOfflineTables(ret);
                this.props.navigator.push({name: 'map'});
            })
            .catch(err => {
                console.warn(err.message);
                switch (err.name) {
                    case 'NotFoundError':
                        alert("onPressMap:没有数据");
                        break;
                    case 'ExpiredError':
                        alert('onPressMap:出错了');
                        break;
                    default:
                        alert('onPressMap:' + err.name);
                        break;
                }
            });
    }

    onPressBack = ()=>{
        this.props.navigator.push({name: 'login'});
    };

    // //下载数据
    // onTest(){
    //     let { loginactions,login } = this.props;
    //     loginactions.getUserPrivilege(login.server,login.userid,(projects)=>{
    //         projects.forEach((ele)=>{
    //             console.log(login);
    //             let projectid = login.userid+'-'+ele.PRIVILEGENAME;
    //             loginactions.getAllData(login.server,login.userid,ele.PRIVILEGENAME,(data)=>{
    //                 storage.save({
    //                     key: 'projectid',  // 注意:请不要在key中使用_下划线符号!
    //                     id: projectid,
    //                     rawData: data,
    //                     expires: null,//1000 * 3600
    //                 });

    //             });
    //         });
    //         alert("操作成功");
    //         //console.log(login.projects)
    //     });
    // }
    //下载数据
    onDownLoadData(ele){
        let { loginactions,login } = this.props;

                console.log('onDownLoadData' + ele);
                let projectid = login.userid+'-'+ele.PRIVILEGENAME;
                loginactions.getAllData(login.server,login.userid,ele.PRIVILEGENAME,(data)=>{
                    storage.save({
                        key: 'projectid',  // 注意:请不要在key中使用_下划线符号!
                        id: projectid,
                        rawData: data,
                        expires: null,//1000 * 3600
                    });

                });
        
             Alert.alert('成功',"下载数据成功",[{text: '确定', onPress: () => console.log('下载数据成功')},]);
            //console.log(login.projects)
    
    }

    loadData = ()=>{
        let { loginactions,login } = this.props;
        if(!login.offline){
            console.log(login.server);
            loginactions.getUserPrivilege(login.server,login.userid,(projects)=>{
                projects.forEach((ele)=>{
                    //console.log(ele.PRIVILEGENAME);
                    let projectid = login.userid+'-'+ele.PRIVILEGENAME;
                    storage.load({
                            key: 'projectid',
                            id:projectid,
                            autoSync: false,//true,
                            syncInBackground: false,//true
                        })
                        .then(ret => {
                            //alert("数据已存在");
                        })
                        .catch(err => {
                            console.warn(err.message);
                            switch (err.name) {
                                case 'NotFoundError':
                                    loginactions.getAllData(login.server,login.userid,ele.PRIVILEGENAME,(data)=>{
                                        storage.save({
                                            key: 'projectid',  // 注意:请不要在key中使用_下划线符号!
                                            id:projectid,
                                            rawData: data,
                                            expires: null,//1000 * 3600
                                        });
                                    });
                                    break;
                                case 'ExpiredError':
                                    alert('出错了');
                                    break;
                            }
                        });
                    //console.log(ele);
                });
                //console.log(login.projects)
            });
        }
        else {
            if(!login.projects){
                storage.load({
                        key: 'userid',
                        id:login.userid,
                        autoSync: false,//true, // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                        syncInBackground: false,//true
                    })
                    .then(ret => {
                        loginactions.getOfflineData(ret);
                    })
                    .catch(err => {
                        console.warn(err.message);
                        switch (err.name) {
                            case 'NotFoundError':
                                alert('未找到数据');
                                break;
                            case 'ExpiredError':
                                alert('出错了');
                                break;
                        }
                    });
            }
        }
    };

    // renderProgressEntry = (entry)=>{
    //     //styles.style_view_commit
    //     //listStyles.li
    //     return (
    //         <TouchableHighlight
    //             onPress={this.onPressMap.bind(this,entry)}
    //             underlayColor="transparent"
    //             activeOpacity={0.5}>
    //             <View style={styles.style_view_commit}>
    //                 <View>
    //                     <Text style={{color:'#fff'}}>{entry}</Text>
    //                 </View>
    //             </View>
    //         </TouchableHighlight>
    //     )
    // }

    // onUpload = ()=>{
    //     let {loginactions,login} = this.props;
    //     if(this.projectList){
    //         this.projectList.forEach((ele,i)=>{
    //             let projectid = login.userid+'-'+ele.PRIVILEGENAME;
    //             storage.load({
    //                     key: 'projectid',
    //                     id:projectid,
    //                     autoSync: false,//true,
    //                     syncInBackground: false,//true
    //                 })
    //                 .then(ret => {
    //                     loginactions.setAllData(login.server,login.userid,ele.PRIVILEGENAME,ret);
    //                 })
    //                 .catch(err => {
    //                     console.warn(err.message);
    //                     switch (err.name) {
    //                         case 'NotFoundError':
    //                             break;
    //                         case 'ExpiredError':
    //                             alert('出错了');
    //                             break;
    //                         default:
    //                             break;
    //                     }
    //                 });

    //         })
    //     }
    // };

    render() {

        let { loginactions,login } = this.props;
        let ProjectArray = [];//.bind(this,ele)

        if(login.projects){
            this.projectList = login.projects;
        }

        if(this.projectList && this.projectList.length > 0){
            this.projectList.forEach((ele,i)=>{
               
                ProjectArray.push(

                <View style={{flex: 1, flexDirection: 'row'}}>
                <TouchableHighlight
                style={{flex: 6}}
                    key = {i}
                    onPress={this.onPressMap.bind(this,ele.PRIVILEGENAME)}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View style={{marginTop:15,marginLeft:10,marginRight:10,backgroundColor:'#63B8FF',height:35,borderRadius:5, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color:'#fff'}} >
                           {ele.PRIVILEGENAME}
                        </Text>
                    </View>
                </TouchableHighlight>

{
    (!login.offline)&&(
                <TouchableHighlight
                style={{flex: 2}}
                    key = {"a"+i}
                    onPress={this.onDownLoadData.bind(this,ele.PRIVILEGENAME)}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View style={{marginTop:15,marginLeft:10,marginRight:10,backgroundColor:'#03B8FF',height:35,borderRadius:5, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color:'#fff'}} >
                            {'下载数据'}
                        </Text>
                    </View>
                </TouchableHighlight>
)
}

                </View>
                )
            })
        }

        console.log(!login.offline);
        return (
            <ScrollView >
                <Text style={styles.welcome} >
                    选择项目
                </Text>
                {ProjectArray}


                <TouchableHighlight
                    style={[styles.style_view_exit,{top : 0 ,left : 0}]}
                    onPress={this.onPressBack}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View >
                        <Text style={{color:'#fff'}} >
                            {'退出'}
                        </Text>
                    </View>
                </TouchableHighlight>

            </ScrollView>
        );

    }
}

const styles = StyleSheet.create({
    style_view_exit:{
        marginTop:25,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'#72d0eb',//#63B8FF//#7ebd26
        height:35,
        //width:60,
        //borderRadius:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        color:'#63B8FF',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    cell: {
        width: 16,
        height: 16,
        borderRadius: 3,
        backgroundColor: '#7b8994',
        margin: 2,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellX: {
        backgroundColor: '#72d0eb',
    },
    cellO: {
        backgroundColor: '#7ebd26',
    },
    cellText: {
        fontSize: 50,
        fontFamily: 'AvenirNext-Bold',
    },
    cellTextX: {
        color: '#19a9e5',
    },
    cellTextO: {
        color: '#b9dc2f',
    },
    style_view_commit:{
        marginTop:15,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'#63B8FF',
        height:35,
        borderRadius:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    style_view_Left:{
        flex: 1,
        marginTop:15,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'#63B8FF',
        height:35,
        width:150,
        borderRadius:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    style_view_Right:{
        marginTop:15,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'#63B8FF',
        height:35,
        borderRadius:5,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

function mapStateToProps(state){
    return {
        cell : state.cell.toJS(),
        login : state.login.toJS()
    }
}

function mapDispatchToProps(dispatch){
    return {
        projectActions : bindActionCreators( projectActions , dispatch ),
        loginactions : bindActionCreators( loginActions , dispatch )
    }
}
//export default
export default connect(
    mapStateToProps ,
    mapDispatchToProps
)(WelcomeView);

