<template>
    <div class="modal-wrap modal-signin-wrap" :class="show ? 'active' : ''">
        <span class="center-helper"></span>
        <div class="modal modal-signup">
            <!-- <p @click="add" style="z-index:1;position:relative;">{{login_status}}</p> -->
            <div class="img">
                <img src="../assets/images/login_img1.png" v-if="status == 1" />
                <img src="../assets/images/login_img2.png" v-if="status == 2" />
                <img src="../assets/images/login_img3.png" v-if="status == 3" />
            </div>
            <h2 class="modal-title">登录</h2>
            <a @click="close" href="javascript:;" class="modal-close"><i class="icon icon-close-black"></i></a>
            <div class="modal-content">
                <div class="signup-form">
                    <div class="input-wrap">
                        <input v-model="form.email" type="text" placeholder="邮箱" class="base-input" id="name" />
                        <p class="error-info input-info hidden">长度至少 6 位</p>
                    </div>
                    <div class="input-wrap">
                        <input v-model="form.password" type="password" placeholder="密码" class="base-input" id="pwd" />
                        <p class="error-info input-info hidden">长度至少 6 位</p>
                    </div>
                    <a @click="login" href="javascript:;" class="btn signup-btn btn-blue">确认登录</a>
                    <p class="reg">
                        没有账号？<span @click="register" class="act">注册</span><span class="act act1">忘记密码</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { showMsg } from '~utils'
import $ from 'jquery'
// import api from '~api'
export default {
    name: 'sign-in',
    props: ['show'],
    data() {
        return {
            form: {
                email: '',
                password: ''
            },
            status: 1
        }
    },
    mounted() {
        var _self = this
        $('#name').blur(function() {
            var val = $('#name').val()
            _self.status = 1
            console.log(_self.status)
            if (!(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/).test(val)) {
                showMsg('请输入正确的邮箱！')
            } else {
            }
        })
        $('#name').focus(function() {
            _self.status = 2
            console.log(_self.status)
        })
        $('#pwd').blur(function() {
            var val = $('#pwd').val()
            _self.status = 1
            console.log(_self.status)
            if (val == '') {
                showMsg('密码不能为空')
            } else {
            }
        })
        $('#pwd').focus(function() {
            console.log(_self.status)
            _self.status = 3
        })
    },
    /*  watch:{
      'status'(val){
          console.log('ok')
        this.login_status = val
      }
    }, */
    methods: {
        add() {
            this.login_status++
            console.log(this.login_status)
        },
        close() {
            this.$store.commit('global/showLoginModal', false)
        },
        register() {
            this.$store.commit('global/showLoginModal', false)
            this.$store.commit('global/showRegisterModal', true)
        },
        async login() {
            if (!this.form.email || !this.form.password) {
                showMsg('请将表单填写完整!')
                return
            }
            const { code, message } = await this.$store.$api.post('frontend/user/login', this.form)
            if (code === 200) {
                showMsg({
                    type: 'success',
                    content: message
                })
                this.$router.go(0)
            }
        }
    }
}
</script>
<style scoped>
.modal-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    font-size: 0;
    padding-left: 1px;
    padding-right: 1px;
    text-align: center;
    font-size: 0.1px;
    background: black;
    background: rgba(0, 0, 0, 0.3);
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
}

.modal-wrap.active {
    visibility: visible;
    opacity: 1;
    overflow: auto;
    pointer-events: auto;
}

.modal-wrap.active .modal {
    visibility: visible;
    opacity: 1;
}

.modal-wrap .center-helper {
    display: inline-block;
    height: 100%;
    vertical-align: middle;
    margin-left: -1px;
}

.modal {
    display: inline-block;
    vertical-align: middle;
    font-size: 16px;
    text-align: left;
    visibility: hidden;
    opacity: 0;
    background: white;
    margin: auto;
    width: 360px;
    border-radius: 12px;
    padding: 25px;
    box-sizing: border-box;
    position: relative;
}

.modal .modal-prev {
    width: 78px;
    height: 78px;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0.25;
}

.modal .modal-prev:hover {
    opacity: 1;
}

.modal .modal-prev .icon {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -10px;
    margin-left: -10px;
}

.modal .modal-close {
    width: 78px;
    height: 78px;
    position: absolute;
    right: 0;
    top: 0;
    opacity: 0.25;
}

.modal .modal-close:hover {
    opacity: 1;
}

.modal .modal-close .icon {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -8px;
    margin-left: -8px;
}

.modal .modal-title {
    text-align: left;
    font-size: 20px;
    font-weight: normal;
    letter-spacing: 0.2em;
    text-indent: 0.2em;
    margin-left: 1rem;
    margin-top: 1rem;
}
.modal > .img {
    position: absolute;
    top: -90px;
    width: 100%;
    left: -0px;
}
.modal > .img > img {
    position: relative;
    width: 150px;
    left: 50%;
    transform: translate(-50%, 0);
}
.reg {
    position: relative;
    margin-top: 20px;
    text-align: left;
}
.reg > .act {
    color: #007fff;
}
.reg > .act:hover {
    cursor: pointer;
}
.reg > .act1 {
    color: #007fff;
    float: right;
}
</style>
