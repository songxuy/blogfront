<template>
    <div class="dongt">
        <div v-if="list.length > 0">
            <div v-for="(item, index) in list" v-bind:key="index">
                <div class="item" v-if="item.auther_id">
                    <p>{{ info.username }} &nbsp;<span style="color:#8a9aa9;">赞了这篇文章</span></p>
                    <div class="content">
                        <div class="info">
                            <img :src="item.usericon" />
                            <div class="u_info">
                                <p>{{ item.username }}</p>
                                <p>{{ item.category_name }}·{{ getDay(item.update_date) }}</p>
                            </div>
                            <div class="gz gz1" v-if="!item.isGz" @click="guanzhu(item.auther_id, index)">
                                关注
                            </div>
                            <div class="gz" v-else @click="unguanzhu(item.auther_id, index)">
                                已关注
                            </div>
                        </div>
                        <div class="title" @click="toartical(item._id)">
                            {{ item.title }}
                        </div>
                        <!-- <div class="actions-wrap">
                    <a v-if=""  href="javascript:;" class="action-item active"><i class="icon icon-action-voteup-active"></i><span class="text">20 赞</span></a>
                    <a v-else @click="like" href="javascript:;" class="action-item"><i class="icon icon-action-voteup"></i><span class="text">{{ item.like }} 赞</span></a>
                    <router-link to="/" class="action-item"><i class="icon icon-action-comment"></i><span class="text">1 评论</span></router-link>
                    <a href="javascript:;" class="action-item action-item-fav"><i class="icon icon-action-fav"></i><span class="text">{{ 55 }} 浏览</span></a>
                    <a @click="share" href="javascript:;" class="action-item"><i class="icon icon-action-share"></i><span class="text">分享</span></a>
                </div> -->
                    </div>
                </div>
                <div class="item2" v-else>
                    <span style="font-size:18px;font-weight:800;">{{ info.username }}</span
                    ><span style="font-size:15px;font-weight:500;color:#909090;">关注了</span
                    ><span style="font-size:18px;font-weight:800;margin-left:20px;color:#6cbd45;">{{
                        item.username
                    }}</span>
                </div>
            </div>
        </div>
        <p v-else style="position:realtive;background-color:#fff;text-align:center;padding:25px 0;font-size:16px;">
            您还没有任何动态~ 快去关注点赞吧！
        </p>
    </div>
</template>
<script>
import cookies from 'js-cookie'
import { showMsg } from '~utils'
import axios from 'axios'
// import api from '~api'
export default {
    name: 'dongt',
    props: {
        info: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            list: []
        }
    },
    mounted() {
        var that = this
        axios
            .post('/api/frontend/user/dnalist', {
                id: this.info._id
            })
            .then(res => {
                that.list = res.data.data
            })
            .catch(function(error) {
                //alert(error);
            })
    },
    methods: {
        toartical(i) {
            this.$router.push('/article/' + i)
        },
        unguanzhu(id, i) {
            var that = this
            axios
                .post('/api/frontend/user/deladd', {
                    f_id: id
                })
                .then(res => {
                    that.list[i].isGz = false
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
                    that.list[i].isGz = true
                    showMsg({
                        type: 'success',
                        content: res.data.message
                    })
                })
                .catch(function(error) {
                    //alert(error);
                })
        },
        getDay(day) {
            var now = new Date().getTime()
            var write = new Date(day.replace(/\-/g, '/')).getTime()
            var cha = (now - write) / 1000
            var year = Math.floor(cha / 3600 / 24 / 30 / 12)
            var month = Math.floor((cha - year * 3600 * 24 * 30 * 12) / 3600 / 24 / 30)
            var day = Math.floor((cha - year * 3600 * 24 * 30 * 12 - month * 3600 * 24 * 30) / 3600 / 24)
            var hour = Math.floor((cha - year * 3600 * 24 * 30 * 12 - month * 3600 * 24 * 30 - day * 3600 * 24) / 3600)
            var min = Math.floor(
                (cha - year * 3600 * 24 * 30 * 12 - month * 3600 * 24 * 30 - day * 3600 * 24 - hour * 3600) / 60
            )
            var sec = Math.floor(
                cha - year * 3600 * 24 * 30 * 12 - month * 3600 * 24 * 30 - day * 3600 * 24 - hour * 3600 - min * 60
            )
            if (year > 0) {
                return year + '年前'
            } else if (month > 0) {
                return month + '月前'
            } else if (day > 0) {
                return day + '天前'
            } else if (hour > 0) {
                return hour + '小时前'
            } else if (min > 0) {
                return min + '分钟前'
            } else if (sec > 0) {
                return sec + '秒前'
            }
        },
        share() {
            const top = window.screen.height / 2 - 250
            const left = window.screen.width / 2 - 300
            const title = this.item.title + ' - M.M.F 小屋'
            const url = 'https://www.mmxiaowu.com/article/' + this.item._id
            window.open(
                'http://service.weibo.com/share/share.php?title=' +
                    encodeURIComponent(title.replace(/&nbsp;/g, ' ').replace(/<br \/>/g, ' ')) +
                    '&url=' +
                    encodeURIComponent(url),
                '分享至新浪微博',
                'height=500, width=600, top=' +
                    top +
                    ', left=' +
                    left +
                    ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no'
            )
        }
    }
}
</script>
<style scoped>
.dongt {
    position: relative;
    width: 100%;
}
.dongt .item {
    position: relative;
    background-color: #fff;
    margin-bottom: 5px;
}
.dongt .item2 {
    position: relative;
    background-color: #fff;
    margin-bottom: 5px;
    border-bottom: 1px solid #f1f1f1;
}
.dongt .item2 > span:nth-child(1) {
    position: relative;
    display: inline-block;
    padding: 20px;
}
.dongt .item > p {
    font-size: 14px;
    padding-left: 30px;
    padding-top: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f1f1f1;
}
.dongt .item > .content {
    position: relative;
}
.dongt .item > .content > .info {
    position: relative;
    padding: 20px;
    padding-bottom: 5px;
    display: flex;
    align-items: center;
}
.dongt .item > .content > .info > img {
    position: relative;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 10px;
}
.dongt .item > .content > .info > .u_info > p:nth-child(1) {
    font-weight: 600;
    font-size: 15px;
}
.dongt .item > .content > .info > .u_info > p:nth-child(2) {
    font-size: 14px;
    color: #8a9aa9;
}
.dongt .item > .content > .title {
    position: relative;
    padding: 5px 20px 20px 70px;
    font-weight: 800;
    font-size: 18px;
    cursor: pointer;
}
div.gz {
    position: absolute;
    display: inline-block;
    top: 20px;
    right: 20px;
    margin: 0 0 0 auto;
    padding: 0;
    width: 55px;
    height: 26px;
    font-size: 13px;
    border: 1px solid #6cbd45;
    color: #6cbd45;
    background-color: #fff;
    text-align: center;
    cursor: pointer;
    line-height: 26px;
}
div.gz1 {
    position: absolute;
    display: inline-block;
    top: 20px;
    right: 20px;
    margin: 0 0 0 auto;
    padding: 0;
    width: 55px;
    height: 26px;
    font-size: 13px;
    cursor: pointer;
    border: 1px solid #007fff;
    color: #007fff;
    background-color: #fff;
    text-align: center;
    line-height: 26px;
}
</style>
