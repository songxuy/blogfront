<template>
    <div class="zan">
        <div class="header">
            <span>赞</span>
            <div class="choose">
                <span class="active">文章({{ info.zanlist.length }})</span>
            </div>
        </div>
        <ul class="item" v-if="info.zanlist.length > 0">
            <li v-for="(item, index) in zanlist" v-bind:key="index">
                <div>
                    <p>
                        <span style="font-weight: 500;color: #b71ed7;font-size:14px;margin-right:3px;">专栏</span>·<span
                            style="font-weight:600;font-size:15px;margin:0 3px;color:#909090;"
                            >{{ item.username }}</span
                        >·<span style="font-weight:400;font-size:14px;margin:0 3px;color:#909090;">{{
                            getDay(item.update_date)
                        }}</span
                        >·<span style="font-weight:400;font-size:14px;margin:0 3px;color:#909090;">{{
                            item.category_name
                        }}</span>
                    </p>
                    <p
                        style="font-size:18px;color:#2e3135;font-weight:800;cursor:pointer;"
                        @click="toartical(item._id)"
                    >
                        {{ item.title }}
                    </p>
                    <actions :item="item"></actions>
                </div>
                <img :src="item.img" class="artical_icon" v-if="item.img !== ''" />
            </li>
        </ul>
        <p
            v-if="info.zanlist.length == 0"
            style="position:realtive;background-color:#fff;text-align:center;padding:25px 0;font-size:16px;"
        >
            您暂时还没有给任何文章点赞~ 快去点赞吧！
        </p>
    </div>
</template>
<script>
import cookies from 'js-cookie'
import { showMsg } from '~utils'
import actions from './item-actions.vue'
import axios from 'axios'
// import api from '~api'
export default {
    name: 'zan',
    components: {
        actions
    },
    props: {
        info: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showtab: 1,
            zanlist: []
        }
    },
    mounted() {
        var that = this
        axios
            .post('/api/frontend/user/zanlist', {
                list: this.info.zanlist
            })
            .then(res => {
                that.zanlist = res.data.data
            })
            .catch(function(error) {
                //alert(error);
            })
    },
    methods: {
        toartical(i) {
            this.$router.push('/article/' + i)
        },
        changeTab(i) {
            this.showtab = i
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
        }
    }
}
</script>
<style scoped>
.zan {
    position: relative;
    width: 100%;
    background-color: #fff;
}
.zan > .header {
    position: relative;
    width: calc(100% -50px);
    padding: 10px 25px;
    border-bottom: 1px solid #f1f1f1;
}
.zan > .header > span {
    position: relative;
    display: inline-block;
    font-size: 15px;
    font-weight: 600;
}
.zan > .header > .choose {
    position: relative;
    display: inline-block;
    float: right;
}
.zan > .header > .choose > span.active {
    color: #000;
}
.zan > .header > .choose > span {
    color: #72777b;
    cursor: pointer;
    font-size: 15px;
    padding: 0 10px;
    position: relative;
    display: inline-block;
}
.zan > .header > .choose > span:not(:last-child):after {
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
.zan > .header > .choose > span:hover {
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
ul.item > li .artical_icon {
    position: absolute;
    right: 20px;
    width: 60px;
    height: 60px;
    top: 20px;
}
ul.item > li > div {
    position: relative;
    padding: 20px 25px 0 25px;
    display: flex;
    flex-direction: column;
}
ul.item > li > div > p:nth-child(2) {
    margin-top: 5px;
    margin-bottom: 10px;
}
ul.item > li > div > img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 10px;
}
ul.item > li > div > div.info {
    width: calc(100% - 55px - 100px);
    position: relative;
}
ul.item > li > div > div.info > p:nth-child(1) {
    color: #2e3135;
    font-weight: 800;
    font-size: 17px;
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
</style>
