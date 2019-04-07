<template>
    <div class="main wrap clearfix">
        <div class="main-left">
            <!-- <template v-if="!article.isLoad">
                <div class="card card-answer">
                    <div class="answer-content">加载中, 请稍等...</div>
                </div>
            </template> -->
            <div v-if="!article.isLoad" class="card card-content-loader">
                <content-loader :height="160" :width="660" :speed="2" primaryColor="#f3f3f3" secondaryColor="#ecebeb">
                    <rect x="70" y="15" rx="4" ry="4" width="117" height="6.4" />
                    <rect x="70" y="35" rx="3" ry="3" width="85" height="6.4" />
                    <rect x="0" y="80" rx="3" ry="3" width="550" height="6.4" />
                    <rect x="0" y="100" rx="3" ry="3" width="620" height="6.4" />
                    <rect x="0" y="120" rx="3" ry="3" width="401" height="6.4" />
                    <rect x="0" y="140" rx="3" ry="3" width="501" height="6.4" />
                    <circle cx="30" cy="30" r="30" />
                </content-loader>
            </div>
            <template v-else-if="article.data._id">
                <!-- <div class="card card-question-head">
                    <div class="question-content">
                        <router-link :to="'/category/' + article.data.category" v-text="article.data.category_name" class="topic-link-item"></router-link>
                        <h2 class="question-title"><router-link :to="'/article/' + article.data._id" v-text="article.data.title" class="question-title-link"></router-link></h2>
                    </div>
                </div> -->
                <div class="card card-answer">
                    <div class="question-content">
                        <div class="icon">
                            <img :src="userinfo.icon" @click="toUser(userinfo._id)" />
                        </div>
                        <div class="info">
                            <p>{{ userinfo.username }}</p>
                            <p>{{ getDay(article.data.update_date) }}&nbsp;&nbsp;阅读{{ article.data.visit }}</p>
                        </div>
                        <div
                            class="gz"
                            v-if="article.data.isGz == -1 || article.data.isGz == undefined"
                            @click="guanzhu()"
                        >
                            关注
                        </div>
                        <div class="gz gz1" v-else @click="unguanzhu()">
                            已关注
                        </div>
                    </div>
                    <p class="title" style="padding:25px;font-size:2rem;font-weight:800;">
                        {{ article.data.title }}
                    </p>
                    <div class="answer-content">
                        <div
                            class="article-content markdown-body content"
                            v-highlight
                            v-html="addTarget(article.data.content)"
                        ></div>
                    </div>
                    <!-- <actions :item="article.data"></actions> -->
                </div>
                <comment :comments="comments" :userinfo="userinfo" id="comment"></comment>
            </template>
            <template v-else>
                <div class="card card-answer">
                    <div class="answer-content">该文章不存在, 或者该文章已经被删除</div>
                </div>
            </template>
        </div>
        <div class="main-right">
            <div class="auther_info">
                <p class="title">关于作者</p>
                <div class="body">
                    <div class="icon">
                        <img :src="userinfo.icon" @click="toUser(userinfo._id)" />
                        <span>{{ userinfo.username }}</span>
                    </div>
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
                        <span>获得赞数&nbsp;{{ userinfo.starNum }}</span>
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
                        <span>获得阅读数&nbsp;{{ userinfo.totalRead }}</span>
                    </div>
                </div>
            </div>
            <category :category="category.slice(0, 5)"></category>
            <trending :trending="trending"></trending>
        </div>
        <leftaction :item="article.data"></leftaction>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ContentLoader } from 'vue-content-loader'
import metaMixin from '~mixins'
import actions from '../components/item-actions.vue'
import category from '../components/aside-category.vue'
import trending from '../components/aside-trending.vue'
import comment from '../components/frontend-comment.vue'
import leftaction from '../components/left-actions.vue'
import marked from 'marked'
/* import hljs from 'highlight.js' */
/* import 'highlight.js/styles/default.css' */
import axios from 'axios'
import { showMsg } from '~utils'
/* Vue.directive('highlight', (el) => {
    let blocks = el.querySelectorAll('pre code')
    blocks.forEach((block) => {
        hljs.highlightBlock(block)
    })
}) */
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false/* ,
    highlight(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(lang, code, true).value
        }
        return hljs.highlightAuto(code).value
    } */
})

export default {
    name: 'frontend-article',
    components: {
        ContentLoader,
        actions,
        comment,
        category,
        trending,
        leftaction
    },
    mixins: [metaMixin],
    data() {
        return {
            userinfo: {}
        }
    },
    async asyncData({ store, route }) {
        console.log('ok')
        const {
            path,
            params: { id }
        } = route
        await Promise.all([
            store.dispatch('global/category/getCategoryList'),
            store.dispatch('frontend/article/getTrending'),
            store.dispatch(`global/comment/getCommentList`, { id, path, page: 1, limit: 10 }),
            store.dispatch(`frontend/article/getArticleItem`, { id, path })
        ])
    },
    beforeRouteUpdate(to, from, next) {
        console.log(to)
        if (to.path !== from.path) this.$options.asyncData({ store: this.$store, route: to })
        next()
    },
    computed: {
        ...mapGetters({
            article: 'frontend/article/getArticleItem',
            comments: 'global/comment/getCommentList',
            category: 'global/category/getCategoryList',
            trending: 'frontend/article/getTrending'
        })
    },
    mounted() {
        // this.$options.asyncData({store: this.$store})
        var _self = this
        axios
            .post('/api/frontend/user/search', {
                auther_id: this.article.data.auther_id
            })
            .then(res => {
                _self.userinfo = res.data.data
                //console.log(_self.userinfo)
            })
            .catch(function(error) {
                //alert(error);
            })
        axios
            .post('/api/frontend/article/read', {
                auther_id: this.article.data.auther_id
            })
            .then(res => {})
            .catch(function(error) {
                //alert(error);
            })
        if (location.hash == '#comment') {
            /* console.log('ok')
          var a = document.createElement('a')
          a.href='#comment'
          a.click() */
            var comment = document.getElementById('comment')
            console.log(window.scrollTo(0, 300))
            window.scrollTo(0, comment.offsetTop)
        }
        window.scrollTo(0, 300)
    },
    methods: {
        toUser(id) {
            this.$router.push({
                name: 'center',
                params: {
                    id
                }
            })
        },
        unguanzhu() {
            var that = this
            axios
                .post('/api/frontend/user/deladd', {
                    f_id: this.article.data.auther_id
                })
                .then(res => {
                    showMsg({
                        type: 'success',
                        content: res.data.message
                    })
                    that.$store.commit('frontend/article/changeArticleItem')
                })
                .catch(function(error) {
                    //alert(error);
                })
        },
        guanzhu() {
            var that = this
            axios
                .post('/api/frontend/user/add', {
                    f_id: this.article.data.auther_id
                })
                .then(res => {
                    showMsg({
                        type: 'success',
                        content: res.data.message
                    })
                    that.$store.commit('frontend/article/changeArticleItem')
                })
                .catch(function(error) {
                    //alert(error);
                })
        },
        getDay(day) {
            var date = new Date(day.replace(/\-/g, '/'))
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var day = date.getDate()
            return year + '年' + (month < 10 ? '0' + month : month) + '月' + (day < 10 ? '0' + day : day) + '日'
        },
        addTarget(content) {
            if (!content) return ''
            content = marked(content)
            /* return content.replace(/<a(.*?)href="http/g, '<a$1target="_blank" href="http') */
            return content
        }
    },
    metaInfo() {
        const title = this.article.data.title ? this.article.data.title + ' - M.M.F 小屋' : 'M.M.F 小屋'
        return {
            title,
            meta: [{ vmid: 'description', name: 'description', content: title }]
        }
    }
}
</script>
<style scoped>
/* @import url(../assets/css/dark.css); */
.card .question-content {
    position: relative;
    padding: 25px 25px 5px 25px;
    width: calc(100% - 50px);
    height: 45px;
}
.card .question-content > div.icon {
    position: relative;
    width: 45px;
    height: 45px;
    display: inline-block;
    margin-right: 10px;
}
.card .question-content > div.icon > img {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    cursor: pointer;
}
.card .question-content > div.info {
    position: relative;
    display: inline-block;
}
.card .question-content > div.info > p:nth-child(1) {
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
}
.card .question-content > div.info > p:nth-child(2) {
    color: #909090;
    font-size: 1rem;
}
.card .question-content > div.gz {
    position: relative;
    display: inline-block;
    float: right;
    margin: 0 0 0 auto;
    padding: 0;
    width: 55px;
    height: 26px;
    font-size: 13px;
    border: 1px solid #6cbd45;
    color: #6cbd45;
    background-color: #fff;
    text-align: center;
    line-height: 26px;
}
.card .question-content > div.gz1 {
    position: relative;
    display: inline-block;
    float: right;
    margin: 0 0 0 auto;
    padding: 0;
    width: 55px;
    height: 26px;
    font-size: 13px;
    border: 1px solid #007fff;
    color: #007fff;
    background-color: #fff;
    text-align: center;
    line-height: 26px;
}
.card .question-content > div.gz:hover {
    cursor: pointer;
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
