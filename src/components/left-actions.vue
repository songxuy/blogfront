<template>
    <div class="left-wrap">
        <!-- <a v-if="item.like_status" @click="like" href="javascript:;" class="action-item active"><i class="icon icon-action-voteup-active"></i><span class="text">{{ item.like }} 赞</span></a>
        <a v-else @click="like" href="javascript:;" class="action-item"><i class="icon icon-action-voteup"></i><span class="text">{{ item.like }} 赞</span></a>
        <a href="javascript:;" class="action-item"><i class="icon icon-action-comment"></i><span class="text">{{ item.comment_count }} 评论</span></a>
        <a href="javascript:;" class="action-item action-item-fav"><i class="icon icon-action-fav"></i><span class="text">{{ item.visit }} 浏览</span></a>
        <a @click="share" href="javascript:;" class="action-item"><i class="icon icon-action-share"></i><span class="text">分享</span></a> -->
        <div :class="item.like_status ? 'heart play' : 'heart'" @click="like" id="heart">
            <div class="box">
                <span :class="item.like_status ? 'active' : ''">{{ item.like }}</span>
            </div>
        </div>
        <a class="comment" href="#comment">
            <div class="box">
                <span>{{ item.comment_count }}</span>
            </div>
        </a>
        <p
            style="margin: 2.5rem 0 1rem;
    font-size: 1rem;
    text-align: center;
    color: #c6c6c6;
    user-select: none;"
        >
            分享
        </p>
        <div class="weib" @click="share">
            <div class="box"></div>
        </div>
    </div>
</template>
<script>
import cookies from 'js-cookie'
import { showMsg } from '~utils'
// import api from '~api'
export default {
    name: 'item-actions',
    props: ['item'],
    data() {
        return {
            isZan: false
        }
    },
    methods: {
        /* zan(){
          var image = document.getElementById("heart")
          var that = this
                if(that.isZan==false){
                    image.classList.add('play');
                    that.isZan=true;
                }else if(that.isZan==true){
                    image.classList.remove('play');
                    that.isZan=false;
                }
        }, */
        async like() {
            const username = cookies.get('user')
            if (!username) {
                showMsg('请先登录!')
                this.$store.commit('global/showLoginModal', true)
                return
            }
            let url = 'frontend/like'
            if (this.item.like_status) url = 'frontend/unlike'
            const { code, message } = await this.$store.$api.get(url, {
                id: this.item._id,
                auther_id: this.item.auther_id
            })
            if (code === 200) {
                var image = document.getElementById('heart')
                var that = this
                if (that.item.like_status == false) {
                    image.classList.add('play')
                } else if (that.item.like_status == true) {
                    image.classList.remove('play')
                }
                showMsg({
                    content: message,
                    type: 'success'
                })
                this.$store.commit('frontend/article/modifyLikeStatus', {
                    id: this.item._id,
                    status: !this.item.like_status
                })
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
.left-wrap {
    position: fixed;
    left: 140px;
    top: 50%;
    width: 60px;
    margin-left: -70px;
    display: flex;
    transform: translate(0, -50%);
    flex-direction: column;
}
div.heart {
    width: 60px;
    height: 60px;
    background: url(../assets/images/web_heart_animation.png) 0 0 no-repeat;
    background-size: 2900% 100%;
    cursor: pointer;
}
div.heart > .box {
    position: relative;
    width: 40px;
    height: 40px;
    background-color: #fff;
    background-repeat: no-repeat;
    border-radius: 50%;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
    cursor: pointer;
    box-sizing: border-box;
    padding: 0px;
    z-index: -1;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
div.heart > .box > span {
    display: inline-block;
    position: absolute;
    padding: 0 3px;
    right: -3px;
    top: -3px;
    background-color: #b2bac2;
    color: #fff;
    font-size: 0.9rem;
    line-height: 1;
    border-radius: 0.7rem;
    white-space: nowrap;
}
div.weib {
    width: 60px;
    height: 60px;
    background: url(https://b-gold-cdn.xitu.io/v3/static/img/weibo.2076a57.svg) no-repeat;
    background-size: 40%;
    background-position: 50% 50%;
    cursor: pointer;
}
div.weib > .box {
    position: relative;
    width: 40px;
    height: 40px;
    background-color: #fff;
    background-repeat: no-repeat;
    border-radius: 50%;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
    cursor: pointer;
    box-sizing: border-box;
    padding: 0px;
    z-index: -1;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
a.comment {
    display: inline-block;
    width: 60px;
    height: 60px;
    background: url(https://b-gold-cdn.xitu.io/v3/static/img/comment.7fc22c2.svg) no-repeat;
    background-size: 30%;
    background-position: 50% 50%;
    cursor: pointer;
}
a.comment > .box {
    position: relative;
    width: 40px;
    height: 40px;
    background-color: #fff;
    background-repeat: no-repeat;
    border-radius: 50%;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
    cursor: pointer;
    box-sizing: border-box;
    padding: 0px;
    z-index: -1;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
a.comment > .box > span {
    display: inline-block;
    position: absolute;
    padding: 0 3px;
    right: -3px;
    top: -3px;
    background-color: #b2bac2;
    color: #fff;
    font-size: 0.9rem;
    line-height: 1;
    border-radius: 0.7rem;
    white-space: nowrap;
}
div.heart > .box > span.active {
    background-color: #e2264d;
}
.play {
    animation: heart-burst steps(28) 0.8s 1 both;
}
@keyframes heart-burst {
    0% {
        background-position: 0%;
    }
    100% {
        background-position: 100%;
    }
}
div.iszan {
    background-position: 100%;
}
</style>
