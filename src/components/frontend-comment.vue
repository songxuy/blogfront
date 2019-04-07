<template>
    <div class="card" id="comment">
        <div class="comments" @click="close">
            <div class="comment-post-wrap">
                <img :src="userinfo.icon" alt="" class="avatar-img" />
                <div class="comment-post-input-wrap base-textarea-wrap">
                    <textarea
                        v-model="form.content"
                        id="content"
                        class="textarea-input base-input"
                        cols="30"
                        rows="4"
                    ></textarea>
                </div>
                <div class="comment-post-actions clearfix">
                    <a @click="postComment()" href="javascript:;" class="btn btn-blue">发表评论</a>
                </div>
            </div>
            <div class="comment-items-wrap" @click.stop>
                <div v-for="(item, index) in comments.data" :key="item._id" class="comment-item">
                    <a href="javascript:;" class="comment-author-avatar-link">
                        <img :src="item.avatar" alt="" class="avatar-img" />
                    </a>
                    <div class="comment-content-wrap">
                        <span class="comment-author-wrap">
                            <a href="javascript:;" class="comment-author">{{ item.username }}</a>
                        </span>
                        <div class="comment-content" v-text="item.content"></div>
                        <div class="comment-footer">
                            <span class="comment-time" v-text="getDay(item.creat_date)"></span>
                            <div class="option">
                                <div class="zan" v-if="!item.isZan" @click="zan(item)">
                                    <svg
                                        data-v-59b29f3e=""
                                        aria-hidden="true"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 20 20"
                                        class="icon like-icon"
                                    >
                                        <g data-v-59b29f3e="" fill="none" fill-rule="evenodd">
                                            <path data-v-59b29f3e="" d="M0 0h20v20H0z"></path>
                                            <path
                                                data-v-59b29f3e=""
                                                stroke="#8A93A0"
                                                stroke-linejoin="round"
                                                d="M4.58 8.25V17h-1.4C2.53 17 2 16.382 2 15.624V9.735c0-.79.552-1.485 1.18-1.485h1.4zM11.322 2c1.011.019 1.614.833 1.823 1.235.382.735.392 1.946.13 2.724-.236.704-.785 1.629-.785 1.629h4.11c.434 0 .838.206 1.107.563.273.365.363.84.24 1.272l-1.86 6.513A1.425 1.425 0 0 1 14.724 17H6.645V7.898C8.502 7.51 9.643 4.59 9.852 3.249A1.47 1.47 0 0 1 11.322 2z"
                                            ></path>
                                        </g></svg
                                    ><span>{{ item.zanNum }}</span>
                                </div>
                                <div class="zan" v-else @click="zan(item)">
                                    <svg
                                        data-v-59b29f3e=""
                                        aria-hidden="true"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 20 20"
                                        class="icon like-icon"
                                    >
                                        <g data-v-59b29f3e="" fill="none" fill-rule="evenodd">
                                            <path data-v-59b29f3e="" d="M0 0h20v20H0z"></path>
                                            <path
                                                data-v-59b29f3e=""
                                                stroke="#37C700"
                                                stroke-linejoin="round"
                                                d="M5.344 8.833V17H4.072C3.482 17 3 16.424 3 15.716V10.22c0-.739.502-1.387 1.072-1.387h1.272zM10.6 4.166c.106-.693.692-1.179 1.335-1.166.918.018 1.465.777 1.655 1.153.346.686.356 1.816.118 2.542-.215.657-.713 1.52-.713 1.52h3.732c.395 0 .762.193 1.006.526.248.341.33.784.218 1.187l-1.69 6.08c-.153.584-.662.992-1.236.992H7.219V8.504c1.686-.361 3.191-3.086 3.381-4.338z"
                                                fill="#37C700"
                                                stroke-width=".964"
                                            ></path>
                                        </g></svg
                                    ><span>{{ item.zanNum }}</span>
                                </div>
                                <a
                                    @click="reply(item, index)"
                                    href="javascript:;"
                                    class="comment-action-item comment-reply"
                                    ><svg
                                        data-v-491c34a9=""
                                        aria-hidden="true"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 20 20"
                                        class="icon comment-icon"
                                        style="position:relative;top:3px;margin-right:3px;"
                                    >
                                        <g data-v-491c34a9="" fill="none" fill-rule="evenodd">
                                            <path data-v-491c34a9="" d="M0 0h20v20H0z"></path>
                                            <path
                                                data-v-491c34a9=""
                                                stroke="#8A93A0"
                                                stroke-linejoin="round"
                                                d="M10 17c-4.142 0-7.5-2.91-7.5-6.5S5.858 4 10 4c4.142 0 7.5 2.91 7.5 6.5 0 1.416-.522 2.726-1.41 3.794-.129.156.41 3.206.41 3.206l-3.265-1.134c-.998.369-2.077.634-3.235.634z"
                                            ></path>
                                        </g></svg
                                    >回复</a
                                >
                            </div>
                        </div>
                        <div class="area">
                            <textarea
                                v-model="form1.content"
                                :id="'content' + index"
                                class="textarea-input contentx"
                            ></textarea>
                            <div class="btn" @click="postComment1(item)">评论</div>
                        </div>
                        <div class="inner_comment" v-if="item.list.length != 0">
                            <div class="comment_item" v-for="(j, k) in item.list" :key="k">
                                <a href="javascript:;" class="comment-author-avatar-link">
                                    <img :src="j.avatar" alt="" class="avatar-img" />
                                </a>
                                <div class="comment-content-wrap">
                                    <span class="comment-author-wrap">
                                        <a href="javascript:;" class="comment-author">{{ j.username }}</a>
                                    </span>
                                    <div class="comment-content" v-text="j.content"></div>
                                    <div class="comment-footer">
                                        <span class="comment-time" v-text="getDay(j.creat_date)"></span>
                                        <div class="option">
                                            <a
                                                @click="reply(j, index.toString() + k.toString())"
                                                href="javascript:;"
                                                class="comment-action-item comment-reply"
                                                ><svg
                                                    data-v-491c34a9=""
                                                    aria-hidden="true"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 20 20"
                                                    class="icon comment-icon"
                                                    style="position:relative;top:3px;margin-right:3px;"
                                                >
                                                    <g data-v-491c34a9="" fill="none" fill-rule="evenodd">
                                                        <path data-v-491c34a9="" d="M0 0h20v20H0z"></path>
                                                        <path
                                                            data-v-491c34a9=""
                                                            stroke="#8A93A0"
                                                            stroke-linejoin="round"
                                                            d="M10 17c-4.142 0-7.5-2.91-7.5-6.5S5.858 4 10 4c4.142 0 7.5 2.91 7.5 6.5 0 1.416-.522 2.726-1.41 3.794-.129.156.41 3.206.41 3.206l-3.265-1.134c-.998.369-2.077.634-3.235.634z"
                                                        ></path>
                                                    </g></svg
                                                >回复</a
                                            >
                                        </div>
                                    </div>
                                    <div class="area">
                                        <textarea
                                            v-model="form1.content"
                                            :id="'content' + index + k"
                                            class="textarea-input contentx"
                                        ></textarea>
                                        <div class="btn" @click="postComment1(j)">评论</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="comments.hasNext" class="load-more-wrap" @click.stop>
                <a @click="loadcomment()" href="javascript:;" class="comments-load-more">加载更多</a>
            </div>
        </div>
    </div>
</template>

<script>
import cookies from 'js-cookie'
import { showMsg } from '~utils'
import axios from 'axios'
import $ from 'jquery'
// import api from '~api'
export default {
    name: 'frontend-comment',
    props: ['comments', 'userinfo'],
    data() {
        return {
            form: {
                id: this.$route.params.id,
                content: ''
            },
            form1: {
                id: this.$route.params.id,
                content: ''
            }
        }
    },
    mounted() {},
    methods: {
        zan(item) {
            /* console.log(this.$store.commit('global/comment/modifyLikeStatu', {
                    id: item._id,
                    status: !item.isZan
            })) */
            const username = cookies.get('user')
            if (!username) {
                showMsg('请先登录!')
                this.$store.commit('global/showLoginModal', true)
                return
            }
            let url = 'frontend/comment/zan'
            if (item.isZan) url = 'frontend/comment/unzan'
            var self = this
            axios
                .post('/api/' + url, {
                    comment_id: item._id
                })
                .then(res => {
                    if (res.data.code == 200) {
                        showMsg({
                            type: 'success',
                            content: res.data.message
                        })
                        self.$store.commit('global/comment/modifyLikeStatu', {
                            id: item._id,
                            status: !item.isZan
                        })
                    } else {
                        showMsg(res.data.message)
                    }
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
        loadcomment() {
            this.$store.dispatch(`global/comment/getCommentList`, {
                id: this.$route.params.id,
                page: this.comments.page + 1,
                limit: 10
            })
        },
        async postComment() {
            const username = cookies.get('user')
            if (!username) {
                showMsg('请先登录!')
                this.$store.commit('global/showLoginModal', true)
            } else if (this.form.content === '') {
                showMsg('请输入评论内容!')
            } else {
                this.form.type = 1
                const { code, data } = await this.$store.$api.post('frontend/comment/insert', this.form)
                if (code === 200) {
                    this.form.content = ''
                    showMsg({
                        content: '评论发布成功!',
                        type: 'success'
                    })
                    this.$store.commit('global/comment/insertCommentItem', data)
                }
            }
        },
        async postComment1(item) {
            const username = cookies.get('user')
            console.log(this.form1)
            if (!username) {
                showMsg('请先登录!')
                this.$store.commit('global/showLoginModal', true)
            } else if (this.form1.content === '') {
                showMsg('请输入评论内容!')
            } else {
                console.log(item)
                this.form1.type = 2
                this.form1.comment_id = item._id
                const { code, data } = await this.$store.$api.post('frontend/comment/insert', this.form1)
                if (code === 200) {
                    this.form1.content = ''
                    showMsg({
                        content: '评论发布成功!',
                        type: 'success'
                    })
                    this.$store.commit('global/comment/insertCommentItem1', data)
                    this.form1.content = ''
                    this.form.content = ''
                    var list = document.querySelectorAll('.contentx')
                    for (var i = 0; i < list.length; i++) {
                        list[i].parentNode.style.display = 'none'
                    }
                }
            }
        },
        reply(item, index) {
            var list = document.querySelectorAll('.contentx')
            for (var i = 0; i < list.length; i++) {
                list[i].parentNode.style.display = 'none'
            }
            this.form1.content = '回复 @' + item.username + ': '
            document.querySelector('#content' + index).parentNode.style.display = 'block'
            document.querySelector('#content' + index).focus()
        },
        close() {
            this.form1.content = ''
            this.form.content = ''
            var list = document.querySelectorAll('.contentx')
            for (var i = 0; i < list.length; i++) {
                list[i].parentNode.style.display = 'none'
            }
        }
    }
}
</script>
<style>
.comment-footer {
    padding-bottom: 20px;
}
.comment-footer > .option {
    position: relative;
    display: inline-block;
    float: right;
}
.comment-footer > .option > div {
    position: relative;
    display: inline-block;
    margin-right: 20px;
}
.comment-footer > .option > div > svg {
    top: 3px;
    position: relative;
    cursor: pointer;
}
.comment-footer > .option > div.zan > svg {
    color: #37c700;
}
.comment-content-wrap .area {
    position: relative;
    background-color: #f4f7f7;
    margin-top: 20px;
    padding-bottom: 50px;
    display: none;
}
.comment-content-wrap .area .contentx {
    position: relative;
    padding: 5px 10px;
    min-height: 35px;
    width: calc(95% - 20px);
    margin-left: 2.5%;
    resize: none;
    overflow-x: hidden;
    background-color: #fff;
    border: 1px solid #007fff;
    margin-top: 15px;
    margin-bottom: 5px;
    line-height: 30px;
}
.comment-content-wrap .area .btn {
    padding: 5px 10px;
    font-size: 14px;
    position: relative;
    color: #fff;
    height: 25px;
    line-height: 25px;
    cursor: pointer;
    display: inline-block;
    float: right;
    margin-right: 2.5%;
    background-color: #027fff;
}
.inner_comment {
    position: relative;
    margin-top: 20px;
}
.comment_item {
    background-color: #fafbfc;
}
</style>
