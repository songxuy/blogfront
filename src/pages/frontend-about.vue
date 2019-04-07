<template>
    <div class="main wrap clearfix">
        <!-- <div class="main-left">
            <div class="card card-answer">
                <div class="answer-content">
                    <div class="article-content">
                        <h3 class="about-title">关于作者</h3>
                        <div class="flex-item">
                            <div class="flex-label">姓名:</div>
                            <div class="flex-content">林岑影</div>
                        </div>
                        <div class="flex-item">
                            <div class="flex-label">年龄:</div>
                            <div class="flex-content">1987.09</div>
                        </div>
                        <div class="flex-item">
                            <div class="flex-label">职业:</div>
                            <div class="flex-content">前端开发</div>
                        </div>
                        <div class="flex-item">
                            <div class="flex-label">Github:</div>
                            <div class="flex-content"><a href="https://github.com/lincenying" target="_blank">@lincenying</a></div>
                        </div>
                        <div class="flex-item">
                            <div class="flex-label">技能:</div>
                            <div class="flex-content">
                                <ul class="about-ul">
                                    <li>HTML5 + CSS3</li>
                                    <li>NodeJS</li>
                                    <li>React</li>
                                    <li>Vue</li>
                                    <li>ES6</li>
                                    <li>Gulp</li>
                                    <li>WebPack</li>
                                    <li>jQuery</li>
                                    <li>PHP</li>
                                </ul>
                            </div>
                        </div>
                        <h3 class="about-title">关于网站</h3>
                        <p>源代码: <a href="https://github.com/lincenying/mmf-blog-vue2-pwa-ssr" target="_blank">mmf-blog-vue2-pwa-ssr</a> 欢迎收藏加星</p>
                        <p>本站服务端采用 express + mongoDB 搭建, 客户端采用 Vue2 的服务端渲染搭建</p>
                        <p>网站分成前台和后台, 前台采用 SSR 模式渲染, 后台采用 SPA 模式</p>
                        <p>主要功能包括: 管理员, 用户, 分类, 文章, 评论, 文章点赞</p>
                        <p>主要技术栈: pwa, webpack, babel, eslint, express, mongoose, vue2, vue2-router, vuex</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-right">
            <trending :trending="trending"></trending>
        </div> -->
        <div class="header">
            <p :class="tab == 1 ? 'active' : ''" @click="changeTab(1)">已关注标签</p>
            <p :class="tab == 2 ? 'active' : ''" @click="changeTab(2)">全部标签</p>
        </div>
        <div class="list" v-if="tab == 1">
            <div class="nodata" v-if="mytag.length == 0">您暂时还没有关注任何标签~ 赶快去关注吧！</div>
            <div class="item" v-else v-for="(item, index) in mytag" :key="index">
                <div>
                    <div class="icon"><img :src="item.icon" /></div>
                    <div class="name">{{ item.cate_name }}</div>
                    <div class="data">
                        <p>
                            <span>{{ item.cate_peo }}</span
                            >关注
                        </p>
                        <p>
                            <span>{{ item.cate_num }}</span
                            >文章
                        </p>
                    </div>
                    <div class="btngz" v-if="!item.isGz">
                        <p @click="guanz(item)">关注</p>
                    </div>
                    <div class="btnygz" v-else>
                        <p @click="unguanz(item)">已关注</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="search" v-if="tab == 2">
            <el-autocomplete
                class="block-input"
                v-model="state2"
                :fetch-suggestions="querySearch"
                placeholder="请输入标签名"
                :trigger-on-focus="false"
                @select="handleSelect"
            >
            </el-autocomplete>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <div class="list" v-if="tab == 2">
            <div class="item" v-for="(item, index) in list" :key="index">
                <div>
                    <div class="icon"><img :src="item.icon" /></div>
                    <div class="name">{{ item.cate_name }}</div>
                    <div class="data">
                        <p>
                            <span>{{ item.cate_peo }}</span
                            >关注
                        </p>
                        <p>
                            <span>{{ item.cate_num }}</span
                            >文章
                        </p>
                    </div>
                    <div class="btngz" v-if="!item.isGz">
                        <p @click="guanz(item)">关注</p>
                    </div>
                    <div class="btnygz" v-else>
                        <p @click="unguanz(item)">已关注</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import metaMixin from '~mixins'
import trending from '../components/aside-trending.vue'
import { showMsg } from '~utils'
export default {
    name: 'frontend-about',
    components: {
        trending
    },
    mixins: [metaMixin],
    data() {
        return {
            tab: 1,
            list: [],
            mytag: [],
            state2: ''
        }
    },
    async asyncData({ store }) {
        await store.dispatch('global/category/getCategoryList')
    },
    methods: {
        guanz(item) {
            var that = this
            axios
                .post('/api/frontend/category/gz', {
                    _id: item._id,
                    cate_name: item.cate_name
                })
                .then(res => {
                    console.log(res)
                    if (res.data.code == 200) {
                        item.isGz = true
                        item.cate_peo++
                        that.mytag.push(item)
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
        unguanz(item) {
            var that = this
            axios
                .post('/api/frontend/category/ungz', {
                    _id: item._id,
                    cate_name: item.cate_name
                })
                .then(res => {
                    console.log(res)
                    if (res.data.code == 200) {
                        item.isGz = false
                        item.cate_peo--
                        that.mytag = that.mytag.filter(i => {
                            return i.cate_name !== item.cate_name
                        })
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
        search() {
            if (this.state2 == '') {
                this.list = this.category
            } else {
                this.category.forEach(item => {
                    if (item.cate_name == this.state2) {
                        this.list = []
                        this.list.push(item)
                    }
                })
                if (this.list.length > 1) {
                    showMsg('该标签不存在')
                }
            }
        },
        querySearch(queryString, cb) {
            var restaurants = this.restaurants
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
            // 调用 callback 返回建议列表的数据
            cb(results)
        },
        handleSelect(item) {
            this.state2 = item.cate_name
        },
        createFilter(queryString) {
            return restaurant => {
                return restaurant.cate_name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
            }
        },
        changeTab(i) {
            this.tab = i
            if (i == 2) {
                this.list = this.category
                this.restaurants = this.category.map(item => {
                    item.value = item.cate_name
                    return item
                })
            }
        }
    },
    computed: {
        ...mapGetters({
            category: 'global/category/getCategoryList'
        })
    },
    mounted() {
        //this.$options.asyncData({store: this.$store})
        var that = this
        this.$store.dispatch('global/category/getCategoryList').then(res => {
            axios
                .get('/api/frontend/user/account')
                .then(result => {
                    if (result.data.data.tag.length > 0) {
                        console.log(result.data.data.tag)
                        /* result.data.data.tag.forEach((item,index) => {
                     that.category.forEach((item2) => {
                         if(item2.cate_name==item){
                           item2.isGz = true
                           that.mytag.push(item2)
                         }
                     })
                 }) */
                        that.category.forEach(item2 => {
                            result.data.data.tag.forEach((item, index) => {
                                if (item2.cate_name == item) {
                                    item2.isGz = true
                                    that.mytag.push(item2)
                                }
                            })
                            if (item2.isGz == undefined) {
                                item2.isGz = false
                            }
                        })
                        console.log(that.mytag)
                    } else {
                        that.category.forEach(item => {
                            item.isGz = false
                        })
                    }
                    console.log(that.category)
                })
                .catch(function(error) {
                    //alert(error);
                })
        })
    },
    metaInfo() {
        return {
            title: '关于 - M.M.F 小屋',
            meta: [{ vmid: 'description', name: 'description', content: 'M.M.F 小屋' }]
        }
    }
}
</script>
<style scoped>
.header {
    position: relative;
    width: 100%;
    height: 50px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    background-color: #fff;
}
.header > p {
    display: inline-block;
    line-height: 50px;
    height: 50px;
    margin-left: 20px;
    font-size: 15px;
    color: #909090;
    cursor: pointer;
    font-weight: 600;
}
.header > p.active {
    color: #007fff;
    border-bottom: 2px solid #007fff;
}
.list {
    position: relative;
    width: 100%;
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
}
.list > .nodata {
    position: relative;
    width: 100%;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    color: #007fff;
}
.list > .item {
    position: relative;
    width: calc(25% - 14px);
    margin: 0 7px;
    margin-bottom: 15px;
}
.list > .item > div {
    background-color: #fff;
    border: 1px solid #f1f1f1;
    transition: border-color 0.3s;
    text-align: center;
    padding: 1.5rem 0;
}
.list > .item > div > div.icon {
    position: relative;
    width: 100%;
    padding: 10px 0;
}
.list > .item > div > div.icon > img {
    position: relative;
    height: 35px;
}
.list > .item > div > div.name {
    position: relative;
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: 900;
    color: #333;
    margin-bottom: 5px;
}
.list > .item > div > div.data {
    position: relative;
    width: 100%;
    color: #909090;
    font-size: 15px;
}
.list > .item > div > div.data > p {
    display: inline-block;
}
.list > .item > div > div.data > p:nth-child(1) {
    margin-right: 10px;
}
.list > .item > div > div.data > p > span {
    margin-right: 5px;
}
.list > .item > div > div.btnygz {
    position: relative;
    height: 55px;
    width: 100%;
}
.list > .item > div > div.btnygz > p {
    background-color: #37c700;
    color: #fff;
    height: 31px;
    margin-top: 12px;
    display: inline-block;
    width: 73px;
    line-height: 31px;
    cursor: pointer;
    font-size: 15px;
}
.list > .item > div > div.btnygz > p:hover {
    background-color: #319a09;
}
.list > .item > div > div.btngz {
    position: relative;
    height: 55px;
    width: 100%;
}
.list > .item > div > div.btngz > p {
    height: 31px;
    margin-top: 12px;
    display: inline-block;
    width: 73px;
    line-height: 31px;
    cursor: pointer;
    font-size: 15px;
    border: 1px solid #37c700;
    background-color: #fff;
    color: #37c700;
}
div.search {
    position: relative;
    margin-top: 20px;
    margin-left: 7px;
}
</style>
