<template>
    <div class="gz">
        <div class="header">
            <span>关注</span>
            <div class="choose">
                <span :class="showtab == 1 ? 'active' : ''" @click="changeTab(1)">关注</span>
                <span :class="showtab == 2 ? 'active' : ''" @click="changeTab(2)">关注者</span>
                <span :class="showtab == 3 ? 'active' : ''" @click="changeTab(3)">关注标签</span>
            </div>
        </div>
        <ul class="item" v-if="showtab == 1 && info.followeelist.length > 0">
            <li v-for="(item, index) in followeelist" v-bind:key="index">
                <div>
                    <img :src="item.icon" />
                    <div class="info">
                        <p>{{ item.username }}</p>
                        <p>{{ item.des }}</p>
                    </div>
                    <div class="btn">
                        <P v-if="item.isGz">已关注</P>
                        <P v-else class="gz">关注</P>
                    </div>
                </div>
            </li>
        </ul>
        <p
            v-if="showtab == 1 && info.followeelist.length == 0"
            style="position:realtive;background-color:#fff;text-align:center;padding:25px 0;font-size:16px;"
        >
            暂时还没有关注的人~
        </p>
        <ul class="item" v-if="showtab == 2 && info.followerlist.length > 0">
            <li v-for="(item, index) in followerlist" v-bind:key="index">
                <div>
                    <img :src="item.icon" />
                    <div class="info">
                        <p>{{ item.username }}</p>
                        <p>{{ item.des }}</p>
                    </div>
                    <div class="btn">
                        <P v-if="item.isGz" @click="unguanzhu(item._id, index)">已关注</P>
                        <P v-else class="gz" @click="guanzhu(item._id, index)">关注</P>
                    </div>
                </div>
            </li>
        </ul>
        <p
            v-if="showtab == 2 && info.followerlist.length == 0"
            style="position:realtive;background-color:#fff;text-align:center;padding:25px 0;font-size:16px;"
        >
            暂时还没有人关注您~ 快去写篇文章吧！
        </p>
        <ul class="item" v-if="showtab == 3 && taglist.length > 0">
            <li v-for="(item, index) in taglist" v-bind:key="index">
                <div>
                    <img :src="item.icon" />
                    <div class="info tag">
                        <p>{{ item.cate_name }}</p>
                    </div>
                    <div class="btn" v-if="item.isGz">
                        <P @click="unguanz(item)">已关注</P>
                    </div>
                    <div class="btn1" v-else>
                        <P @click="guanz(item)">关注</P>
                    </div>
                </div>
            </li>
        </ul>
        <p
            v-if="showtab == 3 && taglist.length == 0"
            style="position:realtive;background-color:#fff;text-align:center;padding:25px 0;font-size:16px;"
        >
            暂时还没有关注任何标签~ 快去关注吧！
        </p>
    </div>
</template>
<script>
import cookies from 'js-cookie'
import { showMsg } from '~utils'
import { mapGetters } from 'vuex'
import axios from 'axios'
// import api from '~api'
export default {
    name: 'guanz',
    props: {
        info: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showtab: 1,
            followeelist: [],
            followerlist: [],
            taglist: []
        }
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
                    if (res.data.code == 200) {
                        item.isGz = true
                        item.cate_peo++
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
                    if (res.data.code == 200) {
                        item.isGz = false
                        item.cate_peo--
                        that.taglist = that.taglist.filter(i => {
                            return i.cate_name !== item.cate_name
                        })
                        console.log(that.taglist)
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
        unguanzhu(id, i) {
            var that = this
            axios
                .post('/api/frontend/user/deladd', {
                    f_id: id
                })
                .then(res => {
                    if (that.showtab == 1) {
                        that.followerlist[i].isGz = false
                    } else if (that.showtab == 2) {
                        that.followeelist[i].isGz = false
                    } else if (that.showtab == 3) {
                        that.taglist[i].isGz = false
                    }
                    showMsg({
                        type: 'success',
                        content: res.data.message
                    })
                })
                .catch(function(error) {
                    //alert(error);
                })
        },
        guanzhu(id, i) {
            var that = this
            axios
                .post('/api/frontend/user/add', {
                    f_id: id
                })
                .then(res => {
                    if (that.showtab == 1) {
                        that.followerlist[i].isGz = true
                    } else if (that.showtab == 2) {
                        that.followeelist[i].isGz = true
                    } else if (that.showtab == 3) {
                        that.taglist[i].isGz = true
                    }
                    showMsg({
                        type: 'success',
                        content: res.data.message
                    })
                })
                .catch(function(error) {
                    //alert(error);
                })
        },
        changeTab(i) {
            this.showtab = i
        }
    },
    computed: {
        ...mapGetters({
            category: 'global/category/getCategoryList'
        })
    },
    mounted() {
        var that = this
        axios
            .post('/api/frontend/user/list', {
                list: this.info.followerlist
            })
            .then(res => {
                that.followerlist = res.data.data
            })
            .catch(function(error) {
                //alert(error);
            })
        axios
            .post('/api/frontend/user/ulist', {
                list: this.info.followeelist
            })
            .then(res => {
                that.followeelist = res.data.data
            })
            .catch(function(error) {
                //alert(error);
            })
        /* axios.post('/api/frontend/user/list',{
           list: this.info.tag
        })
        .then((res) => {
           that.taglist = res.data.data
        })
        .catch(function (error) {
                        //alert(error);
        }); */
        this.$store.dispatch('global/category/getCategoryList').then(res => {
            /* that.info.tag.forEach((item,index) => {
               that.category.forEach((item2) => {
                   if(item2.cate_name==item){
                     item2.isGz = true
                     that.taglist.push(item2)
                   }else{
                     item2.isGz = false
                   }
               })
           }) */
            that.category.forEach(item2 => {
                that.info.tag.forEach((item, index) => {
                    if (item2.cate_name == item) {
                        item2.isGz = true
                        that.taglist.push(item2)
                    }
                })
                if (item2.isGz == undefined) {
                    item2.isGz = false
                }
            })
        })
    }
}
</script>
<style scoped>
.gz {
    position: relative;
    width: 100%;
    background-color: #fff;
}
.gz > .header {
    position: relative;
    width: calc(100% -50px);
    padding: 10px 25px;
    border-bottom: 1px solid #f1f1f1;
}
.gz > .header > span {
    position: relative;
    display: inline-block;
    font-size: 15px;
    font-weight: 600;
}
.gz > .header > .choose {
    position: relative;
    display: inline-block;
    float: right;
}
.gz > .header > .choose > span.active {
    color: #000;
}
.gz > .header > .choose > span {
    color: #72777b;
    cursor: pointer;
    font-size: 15px;
    padding: 0 10px;
    position: relative;
    display: inline-block;
}
.gz > .header > .choose > span:not(:last-child):after {
    content: '';
    position: absolute;
    top: 50%;
    right: 0px;
    margin-top: -10px;
    width: 1px;
    height: 20px;
    background-color: #b2bac2;
    opacity: 0.5;
}
.gz > .header > .choose > span:hover {
    opacity: 0.8;
}
ul.item {
    position: relative;
    width: 100%;
    background-color: #fff;
    display: block;
}
ul.item > li {
    position: relative;
    border-bottom: 1px solid rgba(230, 230, 231, 0.5);
}
ul.item > li > div {
    position: relative;
    padding: 30px 25px;
    display: flex;
    align-items: center;
}
ul.item > li > div > img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 30px;
}
ul.item > li > div > div.info {
    width: calc(100% - 75px - 100px);
    position: relative;
}
ul.item > li > div > div.info > p:nth-child(1) {
    color: #2e3135;
    font-weight: 800;
    font-size: 17px;
}
ul.item > li > div > div.tag > p:nth-child(1) {
    color: #2e3135;
    font-weight: 800;
    font-size: 19px;
}
ul.item > li > div > div.info > p:nth-child(2) {
    font-weight: 500;
    color: #b9c0c8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 15px;
}
ul.item > li > div > div.btn {
    position: relative;
    width: 90px;
    margin-left: 10px;
}
ul.item > li > div > div.btn > p {
    width: 100%;
    background-color: #92c452;
    height: 30px;
    text-align: center;
    cursor: pointer;
    line-height: 30px;
    color: #fff;
    border-radius: 5px;
    font-size: 15px;
}
ul.item > li > div > div.btn1 > p {
    width: 100%;
    background-color: #fff;
    height: 30px;
    text-align: center;
    cursor: pointer;
    line-height: 30px;
    color: #92c452;
    border-radius: 5px;
    font-size: 15px;
}
ul.item > li > div > div.btn > p.gz {
    width: 100%;
    background-color: #007fff;
    height: 30px;
    text-align: center;
    cursor: pointer;
    line-height: 30px;
    color: #fff;
    border-radius: 5px;
    font-size: 15px;
}
</style>
