<template>
    <div class="card feed">
        <div class="feed-content">
            <span class="feed_item" style="color:#b71ed7;">专栏</span
            ><span class="feed_item hov">{{ item.username }}</span
            ><span class="feed_item">{{ getDay(item.update_date) }}</span
            ><span class="feed_item feed_item1 hov"
                ><router-link
                    :to="'/category/' + item.category"
                    v-text="item.category_name"
                    style="color:#909090;"
                    class="hov"
                ></router-link></span
            ><br />
            <div class="feed-main-link-wrap">
                <router-link :to="'/article/' + item._id" v-text="item.title" class="feed-main-link"></router-link>
            </div>
            <img :src="item.img" class="artical_icon" v-if="item.img !== ''" />
            <!-- <div class="feed-desc-wrap">
                <div class="feed-article-content markdown-body" v-text="item.content"></div>
            </div> -->
        </div>
        <actions :item="item"></actions>
    </div>
</template>
<script>
import actions from './item-actions.vue'
export default {
    name: 'topics-item',
    components: {
        actions
    },
    props: ['item'],
    data() {
        return {
            showMore: false
        }
    },
    mounted() {},
    methods: {
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
<style>
.feed .feed_item {
    position: relative;
    color: #909090;
}
.feed .feed_item:hover {
    cursor: pointer;
}
.feed .feed_item:not(:nth-child(4))::after {
    content: '·';
    color: rgb(178, 186, 194);
    margin: 0px 0.4em;
}
.feed .feed_item1::after {
    content: '';
}
.feed .hov:hover {
    color: #007fff;
}
.feed .feed-main-link {
    display: inline-block;
    font-size: 17px;
    font-weight: 600;
    color: #2e3135;
    line-height: 1.32;
    margin-top: 0.5rem;
}
.feed .feed-main-link:visited {
    color: #909090;
}
.feed .feed-main-link-wrap {
    display: inline-block;
}
img.artical_icon {
    position: absolute;
    right: 25px;
    height: 55px;
    width: 55px;
    top: 25px;
}
</style>
