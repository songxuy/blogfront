<template>
    <nav class="global-nav">
        <div v-if="backend" class="wrap1 clearfix">
            <div class="left-part">
                <a href="/" exact class="logo-link"
                    ><i class="icon icon-nav-logo"></i><span class="hidden">S.X.Y 小屋</span></a
                >
                <div class="main-nav">
                    <a href="/" class="nav-link"><i class="icon icon-nav-home"></i><span class="text">首页</span></a>
                    <a href="/trending/visit" class="nav-link"
                        ><i class="icon icon-nav-explore"></i><span class="text">热门</span></a
                    >
                    <a href="/about" class="nav-link"
                        ><i class="icon icon-nav-features"></i><span class="text">标签</span></a
                    >
                </div>
            </div>
        </div>
        <div v-else class="wrap1 clearfix">
            <div class="left-part">
                <router-link to="/" active-class="current" exact class="logo-link"
                    ><img src="../assets/images/z1.png" class="nav_icon" /><img
                        src="../assets/images/x1.png"
                        class="nav_icon"
                    /><img src="../assets/images/y1.png" class="nav_icon" /><span class="hidden"
                        >M.M.F 小屋</span
                    ></router-link
                >
                <div class="main-nav">
                    <router-link to="/" active-class="current" exact class="nav-link"
                        ><i class="icon icon-nav-home"></i><span class="text">首页</span></router-link
                    >
                    <router-link to="/trending/visit" active-class="current" class="nav-link"
                        ><i class="icon icon-nav-explore"></i><span class="text">热门</span></router-link
                    >
                    <router-link to="/about" active-class="current" class="nav-link"
                        ><i class="icon icon-nav-features"></i><span class="text">标签</span></router-link
                    >
                </div>
            </div>
            <div v-if="!backend" class="right-part">
                <span class="nav-search"
                    ><i class="icon icon-search-white"></i
                    ><input @keyup.enter="search($event)" placeholder="记得按回车哦" class="nav-search-input"
                /></span>
                <span class="nav-write" @click="write"><i class="el-icon-document"></i>&nbsp;写文章</span>
                <span v-if="isLogin" class="nav-me"
                    ><a class="nav-me-link" @click="changeshow" style="cursor:pointer;"
                        ><img :src="userinfo.icon" class="nav-avatar-img"/></a
                ></span>
                <span v-else class="nav-me1"
                    ><a @click="login" href="javascript:;" class="nav-me-link1">登录</a>&nbsp;|&nbsp;<a
                        class="nav-me-link1"
                        @click="regis"
                        >注册</a
                    ></span
                >
                <ul :class="show ? 'person_ul show' : 'person_ul'">
                    <div class="itme">
                        <li @click="topage('/insert')">
                            <a
                                ><i class="el-icon-document"></i
                                ><!-- <Icon type="ios-paper-outline"></Icon> -->写文章</a
                            >
                        </li>
                        <li @click="topage('/center')">
                            <router-link to="/user/account" class="nav-me-link"
                                ><i class="icon icon-nav-home" style="width:20px;margin-top:4px;"></i
                                ><!-- <Icon type="android-person"></Icon> -->我的主页</router-link
                            >
                        </li>
                    </div>
                    <li @click="handleLogout">
                        <a
                            ><i class="el-icon-loading"></i
                            ><!-- <Icon type="social-twitter-outline"></Icon> -->退出登录</a
                        >
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import cookies from 'js-cookie'
import { showMsg } from '~utils'
import axios from 'axios'
export default {
    name: 'navigation',
    props: ['backend'],
    data() {
        return {
            isLogin: !!cookies.get('user'),
            show: false,
            userinfo: {
                icon: ''
            }
        }
    },
    mounted() {
        var _self = this
        axios
            .get('/api/frontend/user/account')
            .then(res => {
                _self.userinfo = res.data.data
            })
            .catch(function(error) {
                //alert(error);
            })
    },
    methods: {
        async handleLogout() {
            await this.$store.$api.post('frontend/user/logout', {})
            window.location.href = '/'
        },
        topage(i) {
            const username = cookies.get('user')
            if (!username) {
                showMsg('请先登录!')
                this.$store.commit('global/showLoginModal', true)
                return
            }
            this.show = false
            this.$router.push(i)
        },
        write() {
            const username = cookies.get('user')
            if (!username) {
                showMsg('请先登录!')
                this.$store.commit('global/showLoginModal', true)
                return
            }
            this.$router.push('/insert')
        },
        changeshow() {
            this.show = !this.show
        },
        regis() {
            this.$store.commit('global/showLoginModal', false)
            this.$store.commit('global/showRegisterModal', true)
        },
        login() {
            this.$store.commit('global/showLoginModal', true)
            this.$store.commit('global/showRegisterModal', false)
        },
        search(e) {
            var qs = e.target.value
            if (qs === '') {
                return false
            }
            this.$router.replace('/search/' + qs)
        }
    }
}
</script>
<style scoped>
.right-part .nav-write {
    display: inline-block;
    height: 60px;
    line-height: 60px;
    margin: 0 20px;
    color: #fff;
    font-size: 18px;
}
.right-part .nav-write:hover {
    cursor: pointer;
}
.nav-me1 {
    display: inline-block;
    height: 60px;
    line-height: 60px;
    margin: 0 5px;
    color: #fff;
    font-size: 16px;
}
a.nav-me-link1 {
    color: #fff;
}
a.nav-me-link1:hover {
    cursor: pointer;
}
.nav_icon {
    position: relative;
    height: 50px;
    margin-top: 5px;
}
.wrap1 {
    position: relative;
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
}
.person_ul {
    position: absolute;
    width: 11rem;
    right: 30px;
    top: 60px;
    background-color: #7fe3e8;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(177, 180, 185, 0.45);
    border-radius: 4px;
    color: #fff;
    display: none;
    transition: all 1s;
}
.show {
    display: block;
}
.person_ul > div.itme {
    position: relative;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    padding: 1rem 0;
}
.person_ul li {
    position: relative;
    width: 100%;
}
.person_ul li:hover {
    background-color: #54d9e0;
}
.person_ul li > a {
    position: relative;
    padding: 5px 10px;
    color: #fff;
    display: flex;
    align-items: center;
    cursor: pointer;
}
.person_ul li > a > i {
    margin-right: 10px;
}
</style>
