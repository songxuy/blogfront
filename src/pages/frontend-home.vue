<template>
    <div class="main wrap clearfix">
        <div class="main-left">
            <div class="userinfo">
                <div class="info">
                    <img :src="userinfo.icon" class="icon" />
                    <p class="name">{{ userinfo.username }}</p>
                    <div class="edit" v-if="!isEdit && !otherone" @click="change">编辑个人资料</div>
                    <div class="edit1" v-if="isEdit && !otherone" @click="save">确认保存</div>
                    <div class="edit1" v-if="userinfo.isGz == -1 && otherone" @click="guanzhu(userinfo._id)">
                        关注
                    </div>
                    <div class="edit" v-if="userinfo.isGz != -1 && otherone" @click="unguanzhu(userinfo._id)">
                        已关注
                    </div>
                </div>
                <div class="info_detail" v-if="isEdit">
                    <P class="titel">个人资料</P>
                    <div class="item">
                        <span>头像</span>
                        <img :src="userinfo.icon" />
                        <div class="upload">
                            <p>支持jpg、png格式的图片</p>
                            <p @click="addpicFun">点击上传</p>
                            <input
                                @change="fileChange($event)"
                                type="file"
                                id="upload_file"
                                multiple
                                style="display: none"
                            />
                        </div>
                    </div>
                    <div class="item1">
                        <span>用户名</span>
                        <input type="text" v-model="userinfo.username" placeholder="填写你的用户名" />
                    </div>
                    <div class="item1">
                        <span>性别</span>
                        <input type="text" v-model="userinfo.sex" placeholder="填写你的性别" />
                    </div>
                    <div class="item1">
                        <span>邮箱</span>
                        <input type="text" v-model="userinfo.email" placeholder="填写你的邮箱" />
                    </div>
                    <div class="item1">
                        <span>简介</span>
                        <input
                            type="text"
                            v-model="userinfo.des"
                            placeholder="填写职业技能、擅长的事情、喜欢的事情等"
                        />
                    </div>
                    <div class="item1">
                        <span>Github</span>
                        <input type="text" v-model="userinfo.git" placeholder="填写你的github" />
                    </div>
                    <div class="item1">
                        <span>新密码</span>
                        <input type="text" v-model="pwd" placeholder="填写新密码" />
                    </div>
                </div>
            </div>
            <div class="menu">
                <div :class="tab == 1 ? 'm_item active' : 'm_item'" @click="show(1)">动态</div>
                <div :class="tab == 2 ? 'm_item active' : 'm_item'" @click="show(2)">关注</div>
                <div :class="tab == 3 ? 'm_item active' : 'm_item'" @click="show(3)">
                    赞<span>{{ userinfo.starNum }}</span>
                </div>
                <div :class="tab == 4 ? 'm_item active' : 'm_item'" @click="show(4)">更多</div>
            </div>
            <dongt v-if="tab == 1 && isload" :info="userinfo"></dongt>
            <guanz v-if="tab == 2 && isload" :info="userinfo"></guanz>
            <zan v-if="tab == 3 && isload" :info="userinfo"></zan>
        </div>
        <div class="main-right">
            <div class="auther_info">
                <p class="title">个人成就</p>
                <div class="body">
                    <div class="zan">
                        <svg
                            data-v-ed44d8d4=""
                            data-v-1ec97bc7=""
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="26"
                            viewBox="0 0 25 26"
                            class="zans"
                        >
                            <g
                                data-v-ed44d8d4=""
                                data-v-1ec97bc7=""
                                fill="none"
                                fill-rule="evenodd"
                                transform="translate(0 .57)"
                            >
                                <ellipse
                                    data-v-ed44d8d4=""
                                    data-v-1ec97bc7=""
                                    cx="12.5"
                                    cy="12.57"
                                    fill="#E1EFFF"
                                    rx="12.5"
                                    ry="12.57"
                                ></ellipse>
                                <path
                                    data-v-ed44d8d4=""
                                    data-v-1ec97bc7=""
                                    fill="#7BB9FF"
                                    d="M8.596 11.238V19H7.033C6.463 19 6 18.465 6 17.807v-5.282c0-.685.483-1.287 1.033-1.287h1.563zm4.275-4.156A1.284 1.284 0 0 1 14.156 6c.885.016 1.412.722 1.595 1.07.334.638.343 1.687.114 2.361-.207.61-.687 1.412-.687 1.412h3.596c.38 0 .733.178.969.488.239.317.318.728.21 1.102l-1.628 5.645a1.245 1.245 0 0 1-1.192.922h-7.068v-7.889c1.624-.336 2.623-2.866 2.806-4.029z"
                                ></path>
                            </g>
                        </svg>
                        <span>获得点赞&nbsp;{{ userinfo.starNum }}</span>
                    </div>
                    <div class="read">
                        <svg
                            data-v-ed44d8d4=""
                            data-v-1ec97bc7=""
                            width="25"
                            height="25"
                            viewBox="0 0 25 25"
                            class="icon stat-view-icon zans"
                        >
                            <g data-v-ed44d8d4="" data-v-1ec97bc7="" fill="none" fill-rule="evenodd">
                                <circle
                                    data-v-ed44d8d4=""
                                    data-v-1ec97bc7=""
                                    cx="12.5"
                                    cy="12.5"
                                    r="12.5"
                                    fill="#E1EFFF"
                                ></circle>
                                <path
                                    data-v-ed44d8d4=""
                                    data-v-1ec97bc7=""
                                    fill="#7BB9FF"
                                    d="M4 12.5S6.917 7 12.75 7s8.75 5.5 8.75 5.5-2.917 5.5-8.75 5.5S4 12.5 4 12.5zm8.75 2.292c1.208 0 2.188-1.026 2.188-2.292 0-1.266-.98-2.292-2.188-2.292-1.208 0-2.188 1.026-2.188 2.292 0 1.266.98 2.292 2.188 2.292z"
                                ></path>
                            </g>
                        </svg>
                        <span>文章被阅读&nbsp;{{ userinfo.totalRead }}</span>
                    </div>
                </div>
            </div>
            <div class="guanz">
                <div class="guan">
                    <P>关注了</P>
                    <p>{{ userinfo.followeeNum }}</p>
                </div>
                <div class="guand">
                    <P>关注者</P>
                    <p>{{ userinfo.followerNum }}</p>
                </div>
            </div>
            <div class="right_list">
                <p>
                    <span>关注标签</span><span>{{ userinfo.tag.length }}</span>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { ContentLoader } from 'vue-content-loader'
import metaMixin from '~mixins'
import dongt from '../components/frontend-dt.vue'
import guanz from '../components/frontend-gz.vue'
import zan from '../components/zan.vue'
import topicsItem from '../components/topics-item.vue'
import topicsItemNone from '../components/topics-item-none.vue'
import category from '../components/aside-category.vue'
import trending from '../components/aside-trending.vue'
import axios from 'axios'
import { showMsg } from '~utils'
import cookies from 'js-cookie'
export default {
    name: 'frontend-index',
    components: {
        dongt,
        guanz,
        zan
    },
    mixins: [metaMixin],
    data() {
        return {
            pwd: '',
            userinfo: {
                username: '',
                email: '',
                icon: '',
                des: '',
                git: '',
                sex: '',
                starNum: 0,
                followeeNum: 0,
                followerNum: 0,
                tag: []
            },
            isEdit: false,
            tab: 1,
            otherone: true,
            isload: false
        }
    },
    computed: {
        ...mapGetters({
            topics: 'frontend/article/getArticleList',
            category: 'global/category/getCategoryList',
            trending: 'frontend/article/getTrending'
        })
    },
    mounted() {
        var _self = this
        console.log(typeof this.$route.params.id)
        const userid = cookies
            .get('userid')
            .split(':')[1]
            .slice(1, cookies.get('userid').split(':')[1].length - 1)
        console.log(userid)
        if (this.$route.params.id && this.$route.params.id != userid) {
            axios
                .post('/api/frontend/user/search', {
                    auther_id: this.$route.params.id
                })
                .then(res => {
                    _self.userinfo = res.data.data
                    _self.isload = true
                    console.log(_self.userinfo)
                })
                .catch(function(error) {
                    //alert(error);
                })
        } else {
            axios
                .get('/api/frontend/user/account')
                .then(res => {
                    _self.otherone = false
                    _self.userinfo = res.data.data
                    _self.isload = true
                    console.log(_self.userinfo)
                })
                .catch(function(error) {
                    //alert(error);
                })
        }
    },
    methods: {
        unguanzhu(id) {
            var that = this
            axios
                .post('/api/frontend/user/deladd', {
                    f_id: id
                })
                .then(res => {
                    that.userinfo.isGz = -1
                    showMsg({
                        type: 'success',
                        content: res.data.message
                    })
                })
                .catch(function(error) {
                    //alert(error);
                })
        },
        guanzhu(id) {
            var that = this
            axios
                .post('/api/frontend/user/add', {
                    f_id: id
                })
                .then(res => {
                    that.userinfo.isGz = 1
                    showMsg({
                        type: 'success',
                        content: res.data.message
                    })
                })
                .catch(function(error) {
                    //alert(error);
                })
        },
        show(i) {
            this.tab = i
        },
        addpicFun(e) {
            document.getElementById('upload_file').click()
        },
        fileChange(el) {
            if (!el.target.files[0].size) return // 判断是否有文件数量
            this.fileList(el.target.files) // 获取files文件组传入处理
            el.target.value = '' // 清空val值，以便可以重复添加一张图片
        },
        fileList(files) {
            for (let i = 0; i < files.length; i++) {
                this.fileAdd(files[i])
            }
        },
        fileAdd(file) {
            /* this.ruleForm.imageArr.splice(0, 1) // 去掉原来的
       this.ruleForm.imageArr.push(result) */
            var vm = this
            const reader = new FileReader()
            reader.vue = this
            reader.readAsDataURL(file)
            reader.onload = function() {
                //file.src = this.result
                // console.log(vm.imageArr1)
                console.log(reader)
                if (this.result.slice(11, 13) == 'pn') {
                    axios
                        .post('/api/upload/dataurl', {
                            data: this.result,
                            type: 'image/png'
                        })
                        .then(res => {
                            console.log(res)
                            vm.userinfo.icon = '' // 去掉原来的
                            vm.userinfo.icon = res.data.data
                        })
                } else if (this.result.slice(11, 13) == 'jp') {
                    axios
                        .post('/api/upload/dataurl', {
                            data: this.result,
                            type: 'image/jpeg'
                        })
                        .then(res => {
                            console.log(res)
                            vm.userinfo.icon = '' // 去掉原来的
                            vm.userinfo.icon = res.data.data
                        })
                } else {
                    showMsg('图片格式不存在!')
                }
            }
            console.log(file)
        },
        save() {
            var _self = this
            axios
                .post('/api/frontend/user/account', {
                    email: this.userinfo.email,
                    username: this.userinfo.username,
                    icon: this.userinfo.icon,
                    des: this.userinfo.des,
                    git: this.userinfo.git,
                    password: this.pwd,
                    sex: this.userinfo.sex
                })
                .then(res => {
                    if (res.data.code == 200) {
                        _self.isEdit = false
                        _self.userinfo = res.data.data
                        showMsg({
                            type: 'success',
                            content: res.data.message
                        })
                    } else {
                        showMsg(res.data.message)
                    }
                })
                .catch(function(error) {
                    //alert(error);
                })
        },
        change() {
            this.isEdit = true
        },
        async loadMore(page = this.topics.page + 1) {
            this.$loading.start()
            await this.$options.asyncData({ store: this.$store, route: this.$route }, { page })
            this.$loading.finish()
        }
    },
    metaInfo() {
        var title = 'S.X.Y 小屋'
        const { id, key, by } = this.$route.params
        if (id) {
            const obj = this.category.find(item => item._id === id)
            if (obj) {
                title = obj.cate_name + ' - ' + title
            }
        } else if (key) {
            title = '搜索: ' + key + ' - ' + title
        } else if (by) {
            title = '热门 - ' + title
        }
        return {
            title,
            meta: [{ vmid: 'description', name: 'description', content: title }]
        }
    }
}
</script>
<style scoped>
div.userinfo {
    position: relative;
    width: 100%;
    background-color: #fff;
}
div.userinfo > .info {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    border-radius: 2px;
}
div.userinfo > .info > .icon {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    padding: 25px;
}
div.userinfo > .info > p {
    font-size: 28px;
    font-weight: 800;
}
div.userinfo > .info > .edit {
    widows: 100px;
    height: 35px;
    text-align: center;
    line-height: 35px;
    color: #007fff;
    border: 1px solid #007fff;
    cursor: pointer;
    border-radius: 2px;
    right: 25px;
    padding: 0 10px;
    position: absolute;
}
div.userinfo > .info > .edit1 {
    widows: 100px;
    height: 35px;
    text-align: center;
    line-height: 35px;
    color: #67c23a;
    border: 1px solid #67c23a;
    cursor: pointer;
    border-radius: 2px;
    right: 25px;
    padding: 0 10px;
    position: absolute;
}
div.guanz {
    position: relative;
    width: 100%;
    border-radius: 5px;
    background-color: #fff;
    display: flex;
    align-items: center;
}
div.guanz > div {
    width: 50%;
    margin: 20px 0;
    text-align: center;
}
div.guanz > div > p:nth-child(1) {
    font-size: 16px;
}
div.guanz > div > p:nth-child(2) {
    font-size: 18px;
    font-weight: bold;
}
div.guanz > div:hover {
    cursor: pointer;
    color: #aaa;
}
div.right_list {
    position: relative;
    width: 90%;
    margin: 0 auto;
    margin-top: 20px;
}
div.right_list > p {
    width: 100%;
    padding: 15px 0;
    border-top: 1px solid rgba(230, 230, 231, 1);
}
div.right_list > p:hover {
    cursor: pointer;
    color: #aaa;
}
div.right_list > p:last-child {
    border-bottom: 1px solid rgba(230, 230, 231, 1);
}
div.right_list > p > span:nth-child(2) {
    float: right;
}
div.info_detail {
    position: relative;
    width: 90%;
    margin: 0 auto;
    padding-bottom: 30px;
}
div.info_detail > p {
    position: relative;
    font-size: 28px;
    font-weight: 800;
    padding-left: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f1f1f1;
}
div.info_detail > div.item {
    position: relative;
    /*  width:100%; */
    display: flex;
    padding: 10px 25px;
    align-items: center;
    border-bottom: 1px solid #f1f1f1;
}
div.info_detail > div.item > span {
    font-size: 16px;
    display: inline-block;
    color: #333;
    width: 100px;
}
div.info_detail > div.item > img {
    height: 72px;
    width: 72px;
    margin-right: 30px;
}
div.info_detail > div.item > .upload {
    position: relative;
}
div.info_detail > div.item > .upload > p:nth-child(1) {
    color: #909090;
    font-size: 14px;
    margin-bottom: 15px;
}
div.info_detail > div.item > .upload > p:nth-child(2) {
    background-color: #007fff;
    color: #fff;
    border-radius: 2px;
    border: none;
    padding: 5px 10px;
    text-align: center;
    width: 70px;
    height: 20px;
    line-height: 20px;
    outline: none;
    font-size: 15px;
    transition: background-color 0.3s, color 0.3s;
    cursor: pointer;
}
div.info_detail > div.item1 {
    position: relative;
    /* width:100%; */
    display: flex;
    padding: 30px 25px;
    align-items: center;
    border-bottom: 1px solid #f1f1f1;
}
div.info_detail > div.item1 > span {
    font-size: 16px;
    display: inline-block;
    color: #333;
    width: 100px;
}
div.info_detail > div.item1 > input {
    border: none;
    color: #909090;
    width: calc(100% - 100px);
}
div.menu {
    position: relative;
    width: 100%;
    margin-top: 20px;
    height: 50px;
    border-bottom: 1px solid #ebebeb;
    background-color: #fff;
    display: flex;
    align-items: center;
    border-radius: 0.2rem 0.2rem 0 0;
}
div.menu > div {
    position: relative;
    width: 90px;
    text-align: center;
    cursor: pointer;
    height: 100%;
    line-height: 50px;
    color: #31445b;
    font-size: 17px;
}
div.menu > div > span {
    color: #b2bac2;
    margin-left: 2px;
}
div.menu > div.active > span {
    color: #3780f7;
    margin-left: 2px;
}
div.menu > div.active {
    color: #3780f7;
    box-shadow: inset 0 -2px 0 #3780f7;
}
div.main-right {
    position: fixed;
    top: 60;
    right: calc(50% - 500px);
}
.auther_info {
    position: relative;
    width: 100%;
    background-color: #fff;
    margin-bottom: 20px;
}
.auther_info > p.title {
    position: relative;
    padding: 1rem 1.3rem;
    font-size: 1rem;
    color: #333;
    border-bottom: 1px solid hsla(0, 0%, 58.8%, 0.1);
}
.auther_info > .body {
    position: relative;
    margin-top: 20px;
}
.auther_info > .body > .icon {
    position: relative;
    padding: 1.3rem;
    display: flex;
    align-items: center;
}
.auther_info > .body > .icon > img {
    position: relative;
    height: 50px;
    width: 50px;
    margin-right: 20px;
    border-radius: 50%;
    cursor: pointer;
}
.auther_info > .body > .zan,
.auther_info > .body > .read {
    position: relative;
    margin-bottom: 0.8rem;
    padding: 0 1.3rem;
    display: flex;
    align-items: center;
}
.auther_info > .body > .zan > .zans {
    margin-right: 10px;
}
.auther_info > .body > .read > .zans {
    margin-right: 10px;
}
.auther_info > .body > .read {
    padding-bottom: 20px;
}
</style>
